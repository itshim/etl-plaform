"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const data_service_1 = require("./data.service");
const data_controller_1 = require("./data.controller");
const data_file_entity_1 = require("./entities/data-file.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let DataModule = class DataModule {
};
exports.DataModule = DataModule;
exports.DataModule = DataModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([data_file_entity_1.DataFile]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads/raw',
                    filename: (req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        callback(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
                    },
                }),
                fileFilter: (req, file, callback) => {
                    if (!file.originalname.match(/\.(csv|xlsx)$/)) {
                        return callback(new Error('Only CSV and Excel files are allowed!'), false);
                    }
                    callback(null, true);
                },
            }),
        ],
        providers: [data_service_1.DataService],
        controllers: [data_controller_1.DataController],
    })
], DataModule);
//# sourceMappingURL=data.module.js.map