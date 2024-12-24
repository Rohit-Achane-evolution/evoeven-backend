import { IsString, IsDate, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class EventDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    images: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    category: string;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    updatedAt?: Date;
}
