import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { EventDto } from "./eventdto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class EventService {

    constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService,) { }

    //Create event
    async createEvent(event: EventDto) {
        try {
            const uploadResult = await this.cloudinaryService.uploadImage(event.images);
            event.images = uploadResult.secure_url;
            return await this.prisma.event.create({
                data: event,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error saving the event to the database');
        }
    }

    //Get all events
    async getAllEvents(page: number, limit: number) {
        //  return await this.prisma.event.deleteMany({});

        const skip = (page - 1) * limit;
        const totalCount = await this.prisma.event.count();
        const results = await this.prisma.event.findMany({
            skip,
            take: limit,
        });

        const hasMore = page * limit < totalCount;
        // Return appropriate response
        if (!hasMore && results.length === 0) {
            return {
                message: "No data found for the requested page. Please check the page number or reduce the limit.",
                totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: hasMore,
            };
        }

        return {
            data: results,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: hasMore,
        };
    }


    async deleteEventById(id: number) {
        try {
            // Check if the event exists
            const event = await this.prisma.event.findUnique({ where: { id } });
            if (!event) {
                throw new NotFoundException(`Event with ID ${id} not found`);
            }

            // Delete the event
            return await this.prisma.event.delete({ where: { id } });
        } catch (error) {
            // Catch any Prisma or unexpected errors and rethrow as internal server error
            throw new InternalServerErrorException(`Error deleting event with ID ${id}: ${error.message}`);
        }
    }

    async updateEventById(id: number, event: EventDto) {
        try {
            // Check if the event exists
            const existingEvent = await this.prisma.event.findUnique({ where: { id } });
            if (!existingEvent) {
                throw new NotFoundException(`Event with ID ${id} not found`);
            }

            // Update the event
            return await this.prisma.event.update({
                where: { id },
                data: event,
            });
        } catch (error) {
            // Catch any Prisma or unexpected errors and rethrow as internal server error
            throw new InternalServerErrorException(`Error updating event with ID ${id}: ${error.message}`);
        }
    }

}