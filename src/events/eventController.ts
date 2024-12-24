import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { EventService } from "./eventService";
import { EventDto } from "./eventdto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/Auth/jwt-auth.guard";

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllEvents(@Query('page') page: string, @Query('limit') limit: string) {
        try {

            const pageNumber = parseInt(page, 10) || 1;
            const limitNumber = parseInt(limit, 10) || 10;
            return await this.eventService.getAllEvents(pageNumber, limitNumber);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Unable to fetch Events');
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('images')) // 'images' should match the key in FormData
    async createEvent(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: EventDto,
    ) {
        try {

            // Ensure file exist
            if (!file) {
                throw new BadRequestException('Image file is required');
            }
            // Pass file path and event details to the service
            const event = { ...body, images: file.path }; // Replace images with file path
            return await this.eventService.createEvent(event);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Unable to create Events');
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteEvent(@Param('id', ParseIntPipe) id: number) {
        return await this.eventService.deleteEventById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateEvent(@Param('id', ParseIntPipe) id: number, @Body() body: EventDto) {
        return await this.eventService.updateEventById(id, body);
    }
}