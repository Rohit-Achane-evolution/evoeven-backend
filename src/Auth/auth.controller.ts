import { Controller, Post, UseGuards, Request, Body, HttpCode, HttpStatus, HttpException, Get, Query, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    emailService: any;
    constructor(private authService: AuthService) { }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() login: LoginDto): Promise<{ token: string }> {
        return this.authService.login(login);
    }


    @Post('reset-request')
    async sendMailer(@Body('email') email: string) {
        if (!email) {
            throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
        }
        try {
            await this.authService.sendMail(email);
            return { message: 'Password reset email sent successfully.' };
        } catch (error) {
            console.error('Error sending email:', error);
            throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // // Step 1: Verify the reset token
    // @Get('verify-token')
    // async verifyToken(@Query('token') token: string) {
    //     const email = await this.authService.verifyResetToken(token);
    //     return { email }; // Return email for the frontend to show the reset form
    // }

    // // Step 2: Set a new password
    // @Put('set-new-password')
    // async setNewPassword(
    //     @Query('token') token: string,
    //     @Body() body: { newPassword: string }
    // ) {
    //     await this.authService.resetPassword(token, body.newPassword);
    //     return { message: 'Password has been reset successfully' };
    // }

    @Post('reset-request')
    async requestPasswordReset(@Body('email') email: string): Promise<{ message: string }> {
        if (!email) {
            throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
        }

        await this.authService.sendMail(email);
        return { message: 'Password reset email sent successfully.' };
    }

    @Get('verify-token')
    async verifyResetToken(@Query('token') token: string): Promise<{ email: string }> {
        const email = await this.authService.verifyResetToken(token);
        return { email };
    }

    // @Put('set-new-password')
    // async setNewPassword(
    //     @Query('token') token: string,
    //     @Body('newPassword') newPassword: string,
    // ): Promise<{ message: string }> {
    //     await this.authService.resetPassword(token, newPassword);
    //     return { message: 'Password has been reset successfully.'};
    // }

    @Put('set-new-password')
    async setNewPassword(
        @Query('token') token: string,
        @Body('newPassword') newPassword: string,
        @Body('newEmail') newEmail?: string,
    ): Promise<{ message: string }> {
        await this.authService.resetPassword(token, newPassword, newEmail);
        return { message: 'Account has been updated successfully.' };
    }


}
