import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { DataFile } from './entities/data-file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataFile]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/raw',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv|xlsx)$/)) {
          return callback(
            new Error('Only CSV and Excel files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  ],
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}
