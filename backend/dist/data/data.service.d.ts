import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataFile } from './entities/data-file.entity';
import { User } from '../users/entities/user.entity';
export declare class DataService {
    private dataFileRepository;
    constructor(dataFileRepository: Repository<DataFile>);
    uploadFile(file: Express.Multer.File, user: User): Promise<DataFile | HttpException>;
    getFilePreview(id: number): Promise<any>;
    getFileColumns(id: number): Promise<string[]>;
    generateChart(id: number, chartType: string, xColumn: string): Promise<any>;
    downloadFile(id: number): Promise<{
        path: string;
        filename: string;
    }>;
}
