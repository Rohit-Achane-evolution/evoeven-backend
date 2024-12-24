import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  const prisma = app.get(PrismaService);

  const existingUser = await prisma.user.findFirst({
    where: { username: 'rohitAchane' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('123456', 10); // Hash the password
    await prisma.user.create({
      data: {
        username: 'rohitAchane',
        email: 'rohitAchane999@gmail.com',
        password: hashedPassword,
      },
    });
    console.log('Static user created successfully!');
  } else {
    console.log('Static user already exists!');
  }



  await app.listen(5000);
}
bootstrap();
