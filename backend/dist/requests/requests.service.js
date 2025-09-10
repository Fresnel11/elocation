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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_entity_1 = require("./entities/request.entity");
const request_comment_entity_1 = require("./entities/request-comment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let RequestsService = class RequestsService {
    constructor(requestRepository, requestCommentRepository, userRepository, categoryRepository) {
        this.requestRepository = requestRepository;
        this.requestCommentRepository = requestCommentRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }
    async create(createRequestDto, userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const category = await this.categoryRepository.findOne({ where: { id: createRequestDto.categoryId } });
        if (!user || !category) {
            throw new common_1.NotFoundException('User or category not found');
        }
        const request = this.requestRepository.create(Object.assign(Object.assign({}, createRequestDto), { user,
            category }));
        return this.requestRepository.save(request);
    }
    async findAll(page = 1, limit = 10) {
        const [requests, total] = await this.requestRepository.findAndCount({
            relations: ['user', 'category', 'comments'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            requests,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: ['user', 'category', 'comments', 'comments.user'],
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        return request;
    }
    async addComment(requestId, createCommentDto, userId) {
        const request = await this.findOne(requestId);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const comment = this.requestCommentRepository.create(Object.assign(Object.assign({}, createCommentDto), { request,
            user }));
        return this.requestCommentRepository.save(comment);
    }
    async updateStatus(id, status) {
        const request = await this.findOne(id);
        request.status = status;
        return this.requestRepository.save(request);
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __param(1, (0, typeorm_1.InjectRepository)(request_comment_entity_1.RequestComment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RequestsService);
//# sourceMappingURL=requests.service.js.map