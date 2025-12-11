import nodemailer from "nodemailer";
import { Worker } from "bullmq";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
})

export const worker = new Worker(
    "email-queue",
    async job => {
      const { to, subject, html } = job.data;
  
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });
  
      console.log(`Email sent to ${to}`);
      },
      {
        connection: {
          host: "localhost",
          port: 6379,
        }
      }
  );