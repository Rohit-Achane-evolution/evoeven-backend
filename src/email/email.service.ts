
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailService: MailerService,
        private readonly prisma: PrismaService,
    ) { }

    // Generates a reset token and sends an email
    async sendMail(email: string) {
        // Check if user exists
        const user = await this.prisma.user.findFirst({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15  minutes 
        //Store the token and expiration in the database
        await this.prisma.passwordReset.create({
            data: {
                email,
                token,
                expiresAt,
            },
        });
        //Prepare the reset URL
        const resetUrl = `https://yourapp.com/set-new-password?token=${token}`;
        //Send the reset email
        await this.mailService.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Reset Your Password',
            html: `
                <p>Hello,</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}" target="_blank">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
            `,
        });
    }
}

// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailService {

//     constructor(private readonly mailService: MailerService) {

//     }

//     async sendMail(email: string) {
//         const resetUrl = `https://s3f8s6q2-3000.inc1.devtunnels.ms/set-new-password?email=${email}`;

//         const mail = await this.mailService.sendMail({

//             from: 'rohit.a@evolutioncloud.in',
//             to: email,
//             subject: `EvoEvent Reset Your Password`,
//             html: `
//                 <p>Hello,</p>
//                 <p>You requested a password reset. Click the link below to reset your password:</p>
//                 <a href="${resetUrl}" target="_blank">Reset Password</a>
//                 <p>If you didn't request this, you can safely ignore this email.</p>
//             `,
//         });
//         console.log(mail);
//     }

// }
