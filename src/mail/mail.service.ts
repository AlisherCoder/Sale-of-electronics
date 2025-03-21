import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transport;
  constructor() {
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sidiqjonyusufjanov7@gmail.com',
        pass: 'dhwj ofzg kswh ybzf',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      let message = await this.transport.sendMail({
        to,
        subject,
        text,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
