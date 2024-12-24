import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/userService';
import { LoginDto } from './login.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly mailService: MailerService,

    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }



    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        //const username = 'rohitAchane';
        // Fetch user by username
        const user = await this.prisma.user.findFirst({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        // Check if email matches
        if (user.email !== email) {
            throw new UnauthorizedException('Invalid email or password');
        }
        // Check if password matches (hashed comparison)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
        // Generate JWT token
        const token = this.jwtService.sign({ email: user.email, sub: user.id });

        return { token };
    }


    // async sendMail(email: string) {
    //     // Check if user exists
    //     const user = await this.prisma.user.findFirst({ where: { email } });
    //     if (!user) {
    //         throw new Error('User not found');
    //     }

    //     const token = crypto.randomBytes(32).toString('hex');
    //     const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15  minutes 
    //     //Store the token and expiration in the database
    //     await this.prisma.passwordReset.create({
    //         data: {
    //             email,
    //             token,
    //             expiresAt,
    //         },
    //     });
    //     //Prepare the reset URL
    //     const resetUrl = `https://s3f8s6q2-3000.inc1.devtunnels.ms/set-new-password?token=${token}`;
    //     //Send the reset email
    //     await this.mailService.sendMail({
    //         from: process.env.EMAIL_USERNAME,
    //         to: email,
    //         subject: 'Reset Your Password',
    //         html: `
    //             <p>Hello,</p>
    //             <p>You requested a password reset. Click the link below to reset your password:</p>
    //             <a href="${resetUrl}" target="_blank">Reset Password</a>
    //             <p>If you didn't request this, you can safely ignore this email.</p>
    //         `,
    //     });
    // }

    // async verifyResetToken(token: string) {
    //     const resetRequest = await this.prisma.passwordReset.findFirst({
    //         where: { token },
    //     });
    //     if (!resetRequest) {
    //         throw new NotFoundException('Invalid or expired reset token');
    //     }
    //     // Check if the token has expired
    //     if (new Date() > new Date(resetRequest.expiresAt)) {
    //         throw new BadRequestException('Reset token has expired');
    //     }

    //     // Return the email associated with the token
    //     return resetRequest.email;
    // }


    // // Update the password after verifying the token
    // async resetPassword(token: string, newPassword: string) {
    //     const email = await this.verifyResetToken(token);

    //     const hashedPassword = await bcrypt.hash(newPassword, 10);
    //     console.log(token);
    //     console.log(hashedPassword);
    //     // Update the user's password
    //     await this.prisma.user.update({
    //         where: { email },
    //         data: { password: hashedPassword },
    //     });

    //     // Delete the reset token after use
    //     await this.prisma.passwordReset.deleteMany({
    //         where: { token },
    //     });
    //     return { message: 'Password has been reset successfully' };
    // }

    async sendMail(email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store the hashed token in the database
        await this.prisma.passwordReset.create({
            data: { email, token: hashedToken, expiresAt },
        });

        const resetUrl = `https://s3f8s6q2-3000.inc1.devtunnels.ms/set-new-password?token=${token}`;
        await this.mailService.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 15 minutes.</p>`,
        });
    }

    async verifyResetToken(token: string): Promise<string> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const resetRequest = await this.prisma.passwordReset.findFirst({
            where: { token: hashedToken },
        });

        if (!resetRequest || new Date() > resetRequest.expiresAt) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        return resetRequest.email;
    }

    // async resetPassword(token: string, newPassword: string): Promise<void> {
    //     const email = await this.verifyResetToken(token);
    //     const hashedPassword = await bcrypt.hash(newPassword, 10);
    //     await this.prisma.user.update({
    //         where: { email },
    //         data: { password: hashedPassword },
    //     });
    //     await this.prisma.passwordReset.deleteMany({
    //         where: { email },
    //     });
    // }

    async resetPassword(token: string, newPassword: string, newEmail?: string): Promise<void> {
        const currentEmail = await this.verifyResetToken(token);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateData: any = { password: hashedPassword };
        if (newEmail) {
            updateData.email = newEmail;
        }

        await this.prisma.user.update({
            where: { email: currentEmail },
            data: updateData,
        });

        await this.prisma.passwordReset.deleteMany({
            where: { email: currentEmail },
        });
    }

}
