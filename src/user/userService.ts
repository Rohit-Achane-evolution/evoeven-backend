import { BadRequestException, Get, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { UsersDto } from "./user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }
    async createUser(data: UsersDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            return await this.prisma.user.create({
                data: { ...data, password: hashedPassword },
            });
        } catch (error) {
            throw new InternalServerErrorException('Something went wrong while saving the User');
        }
    }

    // async updateUser(username: string, data: UsersDto) {
    //     const hashedPassword = await bcrypt.hash(data.password, 10);
    //     try {
    //         const user = await this.prisma.user.findFirst({ where: { username } });
    //         if (!user) {
    //             throw new NotFoundException('User not found');
    //         }
    //         return await this.prisma.user.updateMany({
    //             where: { username },
    //             data: {
    //                 email: data.email,
    //                 password: hashedPassword,
    //             },
    //         });
    //     } catch (error) {
    //         throw new InternalServerErrorException('Something went wrong while updating the User');
    //     }
    // }


    // Verify the reset token
   
    async login() {
        const users = await this.prisma.user.findFirst(); // Fetch all users
        return {
            data: users,
        };
    }
    async findByUsername(email: string) {
        return this.prisma.user.findFirst({ where: { email: email } });
    }

}