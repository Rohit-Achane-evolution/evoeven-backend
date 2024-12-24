import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { UserService } from "./userService";
import { UsersDto } from "./user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async login() {
        try {
            return await this.userService.login();
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Unable to fetch User');
        }
    }

    @Post('cerate')
    async createUser(@Body() user: UsersDto) {
        try {
            return await this.userService.createUser(user);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Unable to create User');
        }
    }



    // @Put(':username')
    // async updateUser(
    //     @Param('username') username: string,
    //     @Body() user: UsersDto,
    // ) {
    //     try {
    //         return await this.userService.updateUser(username, user);
    //     } catch (error) {
    //         throw error;
    //     }
    // }


}