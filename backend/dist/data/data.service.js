"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const data_file_entity_1 = require("./entities/data-file.entity");
const path = require("path");
const dataframe_js_1 = require("dataframe-js");
const cleanData_1 = require("./cleanData");
let DataService = class DataService {
    dataFileRepository;
    constructor(dataFileRepository) {
        this.dataFileRepository = dataFileRepository;
    }
    async uploadFile(file, user) {
        const dataFile = new data_file_entity_1.DataFile();
        dataFile.filename = file.filename;
        dataFile.originalName = file.originalname;
        dataFile.mimetype = file.mimetype;
        dataFile.size = file.size;
        dataFile.user = user;
        dataFile.userId = user.id;
        const filePath = path.join(process.cwd(), 'uploads', 'raw', file.filename);
        const fileWritePath = path.join(process.cwd(), 'uploads', 'formatted', file.filename);
        const dfRaw = await dataframe_js_1.DataFrame.fromCSV(filePath, 'utf8');
        const cleanedData = (0, cleanData_1.default)(JSON.parse(dfRaw.toJSON(true)));
        const df = new dataframe_js_1.DataFrame(cleanedData);
        df.toCSV(true, fileWritePath);
        dataFile.columns = Array.isArray(df.listColumns()) ? df.listColumns() : [];
        dataFile.preview = df.toArray().slice(0, 10);
        if (!dataFile || !dataFile.columns || !dataFile.columns.length) {
            throw new common_1.HttpException('Cannot parse file. Either the file is empty or it is malformed. Try another file', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.dataFileRepository.save(dataFile);
    }
    async getFilePreview(id) {
        const dataFile = await this.dataFileRepository.findOne({ where: { id } });
        if (!dataFile) {
            throw new Error('File not found');
        }
        return dataFile.preview;
    }
    async getFileColumns(id) {
        const dataFile = await this.dataFileRepository.findOne({ where: { id } });
        if (!dataFile) {
            throw new Error('File not found');
        }
        return dataFile.columns;
    }
    async generateChart(id, chartType, xColumn) {
        function getRandomHexColor() {
            const hex = Math.floor(Math.random() * 0xffffff).toString(16);
            return `#${hex.padStart(6, '0')}`;
        }
        const dataFile = await this.dataFileRepository.findOne({ where: { id } });
        if (!dataFile) {
            throw new Error('File not found');
        }
        const filePath = path.join(process.cwd(), 'uploads', 'formatted', dataFile.filename);
        const csv = await dataframe_js_1.DataFrame.fromCSV(filePath, 'utf8');
        const _colIndex = csv
            .listColumns()
            .findIndex((_v) => _v === xColumn);
        console.log('df', csv.values);
        const values = csv.toArray().map((_v) => _v[_colIndex]);
        const uniqueValues = Array.from(new Set(values));
        const countValues = uniqueValues.map((_v) => values.reduce((count, current) => {
            return current === _v ? count + 1 : count;
        }, 0));
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
    async downloadFile(id) {
        const dataFile = await this.dataFileRepository.findOne({ where: { id } });
        if (!dataFile) {
            throw new Error('File not found');
        }
        const filePath = path.join(process.cwd(), 'uploads', 'formatted', dataFile.filename);
        return {
            path: filePath,
            filename: dataFile.originalName,
        };
    }
};
exports.DataService = DataService;
exports.DataService = DataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(data_file_entity_1.DataFile)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], DataService);
//# sourceMappingURL=data.service.js.map