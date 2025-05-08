import { DataService } from './data.service';
import { Response } from 'express';
export declare class DataController {
    private dataService;
    constructor(dataService: DataService);
    uploadFile(file: Express.Multer.File, req: any): Promise<import("@nestjs/common").HttpException | import("./entities/data-file.entity").DataFile>;
    getFilePreview(id: string): Promise<any>;
    getFileColumns(id: string): Promise<string[]>;
    generateChart(id: string, chartType: string, xColumn: string): Promise<any>;
    downloadFile(id: string, res: Response): Promise<void>;
}
