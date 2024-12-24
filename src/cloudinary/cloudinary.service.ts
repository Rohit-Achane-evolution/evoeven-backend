

import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private readonly cloudinaryInstance: typeof Cloudinary) { }

    async uploadImage(filePath: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            this.cloudinaryInstance.uploader.upload(filePath, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}
