import { DataService } from './data.service';
import { Response } from 'express';
export declare class DataController {
    private dataService;
    constructor(dataService: DataService);
    uploadFile(file: Express.Multer.File, req: any): unknown;
    getFilePreview(id: string): unknown;
    getFileColumns(id: string): unknown;
    generateChart(id: string, chartType: string, xColumn: string): unknown;
    downloadFile(id: string, res: Response): any;
}
