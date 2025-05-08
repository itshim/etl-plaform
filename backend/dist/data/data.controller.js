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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const data_service_1 = require("./data.service");
const express_1 = require("express");
let DataController = class DataController {
    dataService;
    constructor(dataService) {
        this.dataService = dataService;
    }
    async uploadFile(file, req) {
        return this.dataService.uploadFile(file, req.user);
    }
    async getFilePreview(id) {
        return this.dataService.getFilePreview(parseInt(id));
    }
    async getFileColumns(id) {
        return this.dataService.getFileColumns(parseInt(id));
    }
    async generateChart(id, chartType, xColumn) {
        return this.dataService.generateChart(parseInt(id), chartType, xColumn);
    }
    async downloadFile(id, res) {
        const { path, filename } = await this.dataService.downloadFile(parseInt(id));
        res.download(path, filename);
    }
};
exports.DataController = DataController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getFilePreview", null);
__decorate([
    (0, common_1.Get)(':id/columns'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "getFileColumns", null);
__decorate([
    (0, common_1.Get)(':id/chart'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('chartType')),
    __param(2, (0, common_1.Query)('xColumn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "generateChart", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DataController.prototype, "downloadFile", null);
exports.DataController = DataController = __decorate([
    (0, common_1.Controller)('data'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [data_service_1.DataService])
], DataController);
//# sourceMappingURL=data.controller.js.map