import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DataService } from './data.service';
import { Response } from 'express';

@Controller('data')
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private dataService: DataService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.dataService.uploadFile(file, req.user);
  }

  @Get(':id/preview')
  async getFilePreview(@Param('id') id: string) {
    return this.dataService.getFilePreview(parseInt(id));
  }

  @Get(':id/columns')
  async getFileColumns(@Param('id') id: string) {
    return this.dataService.getFileColumns(parseInt(id));
  }

  @Get(':id/chart')
  async generateChart(
    @Param('id') id: string,
    @Query('chartType') chartType: string,
    @Query('xColumn') xColumn: string,
  ) {
    return this.dataService.generateChart(parseInt(id), chartType, xColumn);
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const { path, filename } = await this.dataService.downloadFile(
      parseInt(id),
    );
    res.download(path, filename);
  }
}
