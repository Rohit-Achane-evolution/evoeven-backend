// src/Routes/analytics/analytics.modules.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";
import { EventController } from "./eventController";
import { EventService } from "./eventService";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
    imports: [PrismaModule, CloudinaryModule,
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const filename = `${Date.now()}-${file.originalname}`;
                    cb(null, filename);
                },
            }),
        }),
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventsModule { }
