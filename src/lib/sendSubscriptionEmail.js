import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSubscriptionEmail({ to, subject, html }) {
  return resend.emails.send({
    from: "PortXBuilder <support@portxbuilder.com>",
    to,
    subject,
    html,
  });
}
