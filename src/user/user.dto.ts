// import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UsersDto {

    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6)
    password: string;
}
