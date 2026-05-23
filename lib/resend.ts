import { Resend } from "resend";
import { STORE_INFO, formatDate, formatPrice } from "./utils";

const RESEND_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.RESEND_TO_ADMIN ?? "admin@parapharmacie.fr";

function emailsDisabled(name: string) {
  console.warn(`[resend] ${name} skipped — RESEND_API_KEY not configured`);
  return null;
}

interface ReservationEmailData {
  customerName: string;
  customerEmail: string;
  confirmationId: string;
  pickupDate: Date | string;
  pickupTime: string;
  items: Array<{ productName: string; quantity: number; price: number | string }>;
  totalAmount: number | string;
}

export async function sendReservationConfirmation(data: ReservationEmailData) {
  if (!resend) return emailsDisabled("sendReservationConfirmation");
  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;">${item.productName}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(item.price)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="background:#d97706;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">⏳ Réservation reçue</h1>
          <p style="color:#fef3c7;margin:8px 0 0;">${STORE_INFO.name}</p>
        </div>
        <div style="padding:32px;">
          <p>Bonjour <strong>${data.customerName}</strong>,</p>
          <p>Nous avons bien reçu votre réservation. Elle est actuellement <strong>en cours de validation</strong> par notre équipe. Vous recevrez une nouvelle notification dès qu&apos;elle passera en préparation.</p>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
            <h3 style="margin:0 0 8px;color:#059669;">📋 Référence : ${data.confirmationId.slice(0, 8).toUpperCase()}</h3>
            <p style="margin:4px 0;color:#374151;">📅 Retrait le : <strong>${formatDate(data.pickupDate)}</strong></p>
            <p style="margin:4px 0;color:#374151;">🕐 Heure : <strong>${data.pickupTime}</strong></p>
            <p style="margin:4px 0;color:#374151;">📍 Adresse : <strong>${STORE_INFO.address}</strong></p>
          </div>

          <h3 style="color:#111827;margin:24px 0 12px;">Vos articles réservés :</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:8px;text-align:left;border-bottom:2px solid #e5e7eb;">Produit</th>
                <th style="padding:8px;text-align:center;border-bottom:2px solid #e5e7eb;">Qté</th>
                <th style="padding:8px;text-align:right;border-bottom:2px solid #e5e7eb;">Prix</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px 8px;font-weight:bold;text-align:right;">Total :</td>
                <td style="padding:12px 8px;font-weight:bold;text-align:right;color:#059669;">${formatPrice(data.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:24px 0;">
            <p style="margin:0;color:#92400e;font-size:14px;">💳 <strong>Paiement en magasin uniquement.</strong> Vous réglerez au moment du retrait.</p>
          </div>

          <p style="color:#6b7280;font-size:14px;">Des questions ? Contactez-nous :<br>
          📞 ${STORE_INFO.phone}<br>
          📧 ${STORE_INFO.email}</p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
          ${STORE_INFO.name} • ${STORE_INFO.address}
        </div>
      </div>
    </body>
    </html>
  `;

  const [customerResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: data.customerEmail,
      subject: `⏳ Réservation reçue - Ref. ${data.confirmationId.slice(0, 8).toUpperCase()}`,
      html,
    }),
    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `🛒 Nouvelle réservation de ${data.customerName}`,
      html: `<p>Nouvelle réservation reçue.</p><p>Client: ${data.customerName} (${data.customerEmail})</p><p>Retrait: ${formatDate(data.pickupDate)} à ${data.pickupTime}</p><p>Total: ${formatPrice(data.totalAmount)}</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/reservations">Voir dans l'admin</a></p>`,
    }),
  ]);

  return { customer: customerResult, admin: adminResult };
}

export async function sendReservationPreparing(data: {
  customerName: string;
  customerEmail: string;
  confirmationId: string;
  pickupDate: Date | string;
  pickupTime: string;
}) {
  if (!resend) return emailsDisabled("sendReservationPreparing");
  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `📦 Votre commande est en préparation - Ref. ${data.confirmationId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#2563eb;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;margin:0;">📦 Commande validée</h1>
        </div>
        <div style="padding:24px;background:#fff;">
          <p>Bonjour <strong>${data.customerName}</strong>,</p>
          <p>Votre réservation a été <strong>validée</strong> par notre équipe et est maintenant <strong>en cours de préparation</strong>.</p>
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:16px 0;">
            <p><strong>📋 Référence :</strong> ${data.confirmationId.slice(0, 8).toUpperCase()}</p>
            <p><strong>📅 Retrait prévu :</strong> ${formatDate(data.pickupDate)} à ${data.pickupTime}</p>
            <p><strong>📍 Adresse :</strong> ${STORE_INFO.address}</p>
          </div>
          <p>Nous vous enverrons une nouvelle notification dès que votre commande sera prête à récupérer.</p>
          <p>À très bientôt ! 💙</p>
        </div>
      </div>
    `,
  });
}

export async function sendReservationReady(data: {
  customerName: string;
  customerEmail: string;
  confirmationId: string;
  pickupDate: Date | string;
  pickupTime: string;
}) {
  if (!resend) return emailsDisabled("sendReservationReady");
  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `🎉 Votre commande est prête ! - Ref. ${data.confirmationId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#059669;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;margin:0;">🎉 Votre commande est prête !</h1>
        </div>
        <div style="padding:24px;background:#fff;">
          <p>Bonjour <strong>${data.customerName}</strong>,</p>
          <p>Bonne nouvelle ! Votre réservation est prête à être retirée.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
            <p><strong>📋 Référence :</strong> ${data.confirmationId.slice(0, 8).toUpperCase()}</p>
            <p><strong>📅 Date :</strong> ${formatDate(data.pickupDate)} à ${data.pickupTime}</p>
            <p><strong>📍 Adresse :</strong> ${STORE_INFO.address}</p>
          </div>
          <p>N'oubliez pas votre pièce d'identité. Le paiement s'effectue en magasin.</p>
          <p>À très bientôt ! 💚</p>
        </div>
      </div>
    `,
  });
}

export async function sendReservationCancelled(data: {
  customerName: string;
  customerEmail: string;
  confirmationId: string;
}) {
  if (!resend) return emailsDisabled("sendReservationCancelled");
  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Annulation de votre réservation - Ref. ${data.confirmationId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <p>Bonjour <strong>${data.customerName}</strong>,</p>
        <p>Votre réservation (Ref. <strong>${data.confirmationId.slice(0, 8).toUpperCase()}</strong>) a été annulée.</p>
        <p>Pour toute question, contactez-nous au <strong>${STORE_INFO.phone}</strong>.</p>
        <p>Cordialement,<br>${STORE_INFO.name}</p>
      </div>
    `,
  });
}
