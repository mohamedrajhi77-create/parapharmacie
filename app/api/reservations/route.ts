import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendReservationConfirmation } from "@/lib/resend";

const reservationSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  pickupDate: z.string(),
  pickupTime: z.string(),
  notes: z.string().optional(),
  totalAmount: z.number().positive(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const reservations = await prisma.reservation.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { name: true, images: true } } } } },
  });

  return NextResponse.json(
    reservations.map((r) => ({
      ...r,
      totalAmount: Number(r.totalAmount),
      items: r.items.map((i) => ({ ...i, price: Number(i.price) })),
    }))
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = reservationSchema.parse(body);

    // Verify products exist and have enough stock
    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, isActive: true },
      });
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product ${item.productId} not available` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.productId}` }, { status: 400 });
      }
    }

    // Create reservation in transaction
    const reservation = await prisma.$transaction(async (tx) => {
      const res = await tx.reservation.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          pickupDate: new Date(data.pickupDate),
          pickupTime: data.pickupTime,
          notes: data.notes,
          totalAmount: data.totalAmount,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });

      // Decrease stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return res;
    });

    // Send confirmation email (non-blocking)
    sendReservationConfirmation({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      confirmationId: reservation.confirmationId,
      pickupDate: reservation.pickupDate,
      pickupTime: data.pickupTime,
      items: data.items.map((i) => ({ productName: i.productName, quantity: i.quantity, price: i.price })),
      totalAmount: data.totalAmount,
    }).catch(console.error);

    return NextResponse.json(
      { id: reservation.id, confirmationId: reservation.confirmationId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Reservation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
