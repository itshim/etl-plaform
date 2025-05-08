import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFile } from './entities/data-file.entity';
import { User } from '../users/entities/user.entity';
import * as path from 'path';
import { DataFrame } from 'dataframe-js';
import cleanData from './cleanData';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(DataFile)
    private dataFileRepository: Repository<DataFile>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    user: User,
  ): Promise<DataFile | HttpException> {
    const dataFile = new DataFile();
    dataFile.filename = file.filename;
    dataFile.originalName = file.originalname;
    dataFile.mimetype = file.mimetype;
    dataFile.size = file.size;
    dataFile.user = user;
    dataFile.userId = user.id;

    const filePath = path.join(process.cwd(), 'uploads', 'raw', file.filename);
    const fileWritePath = path.join(
      process.cwd(),
      'uploads',
      'formatted',
      file.filename,
    );

    const dfRaw = await DataFrame.fromCSV(filePath, 'utf8');

    const cleanedData = cleanData(JSON.parse(dfRaw.toJSON(true)));

    const df = new DataFrame(cleanedData);
    df.toCSV(true, fileWritePath);

    dataFile.columns = Array.isArray(df.listColumns()) ? df.listColumns() : [];
    dataFile.preview = df.toArray().slice(0, 10);

    if (!dataFile || !dataFile.columns || !dataFile.columns.length) {
      throw new HttpException(
        'Cannot parse file. Either the file is empty or it is malformed. Try another file',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.dataFileRepository.save(dataFile);
  }

  async getFilePreview(id: number): Promise<any> {
    const dataFile = await this.dataFileRepository.findOne({ where: { id } });
    if (!dataFile) {
      throw new Error('File not found');
    }
    return dataFile.preview;
  }

  async getFileColumns(id: number): Promise<string[]> {
    const dataFile = await this.dataFileRepository.findOne({ where: { id } });
    if (!dataFile) {
      throw new Error('File not found');
    }
    return dataFile.columns;
  }

  async generateChart(
    id: number,
    chartType: string,
    xColumn: string,
  ): Promise<any> {
    function getRandomHexColor() {
      const hex = Math.floor(Math.random() * 0xffffff).toString(16);
      return `#${hex.padStart(6, '0')}`;
    }

    const dataFile = await this.dataFileRepository.findOne({ where: { id } });
    if (!dataFile) {
      throw new Error('File not found');
    }

    const filePath = path.join(
      process.cwd(),
      'uploads',
      'formatted',
      dataFile.filename,
    );
    const csv = await DataFrame.fromCSV(filePath, 'utf8');
    const _colIndex = csv
      .listColumns()
      .findIndex((_v: string) => _v === xColumn);
    console.log('df', csv.values);
    const values = csv.toArray().map((_v) => _v[_colIndex]);
    const uniqueValues = Array.from(new Set(values));
    const countValues = uniqueValues.map((_v) =>
      values.reduce<string, number>((count, current) => {
        return current === _v ? count + 1 : count;
      }, 0),
    );
    const df = csv.toArray();

    const chartData = {
      type: chartType,
      data: {
        labels: uniqueValues,
        datasets: [
          {
            label: xColumn,
            data: countValues,
            backgroundColor: getRandomHexColor(),
          },
        ],
      },
    };

    return chartData;
  }

  async downloadFile(id: number): Promise<{ path: string; filename: string }> {
    const dataFile = await this.dataFileRepository.findOne({ where: { id } });
    if (!dataFile) {
      throw new Error('File not found');
    }

    const filePath = path.join(
      process.cwd(),
      'uploads',
      'formatted',
      dataFile.filename,
    );
    return {
      path: filePath,
      filename: dataFile.originalName,
    };
  }
}
