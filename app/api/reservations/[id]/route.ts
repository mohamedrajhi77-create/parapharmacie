import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReservationReady, sendReservationCancelled } from "@/lib/resend";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...reservation,
    totalAmount: Number(reservation.totalAmount),
    items: reservation.items.map((i) => ({ ...i, price: Number(i.price) })),
  });
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { ...body },
    });

    // Send email notifications on status change
    if (body.status === "READY") {
      sendReservationReady({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        confirmationId: reservation.confirmationId,
        pickupDate: reservation.pickupDate,
        pickupTime: reservation.pickupTime,
      }).catch(console.error);
    }

    if (body.status === "CANCELLED") {
      // Restore stock
      const items = await prisma.reservationItem.findMany({ where: { reservationId: id } });
      await Promise.all(
        items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        )
      );

      sendReservationCancelled({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        confirmationId: reservation.confirmationId,
      }).catch(console.error);
    }

    return NextResponse.json({ ...reservation, totalAmount: Number(reservation.totalAmount) });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  await prisma.reservation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
