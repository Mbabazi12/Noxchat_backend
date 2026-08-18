import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly fromAddress: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromAddress = process.env.RESEND_FROM_EMAIL || 'Noxchat <onboarding@resend.dev>';
  }

  async sendOtpEmail(to: string, code: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `RESEND_API_KEY not set — skipping real email delivery. OTP for ${to} is ${code}`,
      );
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to,
      subject: 'Your Noxchat verification code',
      html: `<p>Your Noxchat verification code is:</p><h2 style="letter-spacing:4px">${code}</h2><p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
    });

    if (error) {
      this.logger.error(`Failed to send OTP email to ${to}: ${JSON.stringify(error)}`);
      throw new Error('Failed to send verification email');
    }
  }
}
