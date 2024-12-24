// import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
// import { EmailService } from './email.service';

// @Controller('email')
// export class EmailController {
//     constructor(private readonly emailService: EmailService) { }

//     @Post('reset-request')
//     async sendMailer(@Body('email') email: string) {
//         if (!email) {
//             throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
//         }
//         try {
//             await this.emailService.sendMail(email);
//             return { message: 'Password reset email sent successfully.' };
//         } catch (error) {
//             console.error('Error sending email:', error);
//             throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
//         }
//     }
// }
