// src/Routes/analytics/analytics.modules.ts
import { Module } from "@nestjs/common";
import { UserController } from "./userController";
import { UserService } from "./userService";
import { PrismaModule } from "prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UsersModule { }
