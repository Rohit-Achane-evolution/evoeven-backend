import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './user/userModule';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EventsModule } from './events/eventModule';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './Auth/auth.module';
// import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';


console.log('process.env.EMAIL_USERNAME: ', process.env.EMAIL_USERNAME);
console.log('process.env.EMAIL_PASSWORD: ', process.env.EMAIL_PASSWORD);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: true,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    UsersModule,
    PrismaModule,
    EventsModule,
    CloudinaryModule,
    AuthModule,
    // EmailModule
  ],

  controllers: [],
  providers: [],
})
export class AppModule { }

function diskStorage(arg0: {
  destination: string; // Temporary storage location
  filename: (req: any, file: any, callback: any) => void;
}): any {
  throw new Error('Function not implemented.');
}