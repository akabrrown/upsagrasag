import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields (name, email, subject, message) are required' }, { status: 400 });
    }

    const emailResponse = await resend.emails.send({
      from: 'GRASAG Portal <onboarding@resend.dev>',
      to: 'grasagpresident@upsamail.edu.gh',
      subject: `[GRASAG Portal Contact] - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #003366;">New Message from GRASAG-UPSA Portal</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message Detail:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; font-style: italic;">
            ${message.replace(/\n/g, '<br />')}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #777;">This email was automatically generated and sent from the GRASAG-UPSA Portal contact form.</p>
        </div>
      `,
    });

    if (emailResponse.error) {
      throw new Error(emailResponse.error.message);
    }

    return NextResponse.json({ success: true, messageId: emailResponse.data?.id });
  } catch (error: any) {
    console.error('Contact Form Resend Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send your contact message' }, { status: 500 });
  }
}
