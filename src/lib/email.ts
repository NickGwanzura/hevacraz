import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM_EMAIL = "noreply@hevacraz.org";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@hevacraz.org";

export async function sendApplicationConfirmation(
  email: string,
  name: string,
  applicationId: string
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_xxxxxxxxx") {
    console.log(`[EMAIL SKIPPED] Confirmation to ${email} for application ${applicationId}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "HEVACRAZ Membership Application Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f3b5e; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">HEVACRAZ</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #0f3b5e;">Application Received</h2>
            <p>Dear ${name},</p>
            <p>Thank you for submitting your membership application to HEVACRAZ.</p>
            <p>Your application reference ID is: <strong>${applicationId}</strong></p>
            <p>Our team will review your application and get back to you within 5-7 business days.</p>
            <p>Best regards,<br/>HEVACRAZ Membership Team</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}

export async function sendApprovalEmail(email: string, name: string, membershipNumber: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_xxxxxxxxx") {
    console.log(`[EMAIL SKIPPED] Approval to ${email} - ${membershipNumber}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "HEVACRAZ Membership Approved",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f3b5e; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">HEVACRAZ</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #0f3b5e;">Welcome to HEVACRAZ!</h2>
            <p>Dear ${name},</p>
            <p>We are pleased to inform you that your membership application has been <strong style="color: #16a34a;">approved</strong>.</p>
            <p>Your membership number is: <strong style="font-size: 18px; color: #0f3b5e;">${membershipNumber}</strong></p>
            <p>You can now access member-exclusive resources and events.</p>
            <p>Best regards,<br/>HEVACRAZ Membership Team</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send approval email:", error);
  }
}

export async function sendRejectionEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_xxxxxxxxx") {
    console.log(`[EMAIL SKIPPED] Rejection to ${email}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "HEVACRAZ Membership Application Update",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f3b5e; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">HEVACRAZ</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #0f3b5e;">Application Update</h2>
            <p>Dear ${name},</p>
            <p>After careful review, we regret to inform you that your membership application has not been approved at this time.</p>
            <p>If you would like more information or wish to reapply, please contact our membership team.</p>
            <p>Best regards,<br/>HEVACRAZ Membership Team</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send rejection email:", error);
  }
}

export async function sendNewApplicationAlert(applicantName: string, category: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_xxxxxxxxx") {
    console.log(`[EMAIL SKIPPED] New application alert for ${applicantName}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: "New HEVACRAZ Membership Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f3b5e; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">HEVACRAZ</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #0f3b5e;">New Application Received</h2>
            <p>A new membership application has been submitted:</p>
            <ul>
              <li><strong>Name:</strong> ${applicantName}</li>
              <li><strong>Category:</strong> ${category}</li>
            </ul>
            <p>Please log in to the admin dashboard to review this application.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send new application alert:", error);
  }
}
