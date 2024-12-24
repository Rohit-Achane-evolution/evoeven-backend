import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/userService';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'prisma/prisma.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Use environment variables for the secret in production
            signOptions: { expiresIn: process.env.JWT_EXPIRES || '3d' },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, UserService, PrismaService],
    controllers: [AuthController],
    //exports: [AuthService],
})
export class AuthModule { }
