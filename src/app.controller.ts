// ChatController
import { Controller, Get, Post, Body, Param, UseGuards, Request, Res, HttpException, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class ChatController {
    // constructor(private readonly appService: AppService) { }

    // GET APIs
    @Get()
    getChatPage(@Res() res: Response) {
        res.render('index');
    }

}