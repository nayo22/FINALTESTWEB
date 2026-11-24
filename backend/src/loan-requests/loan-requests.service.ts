import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanRequestEntity } from './loan-request.entity';
import { Tool } from './tool.entity';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';

@Injectable()
export class LoanRequestsService {
  constructor(
    @InjectRepository(LoanRequestEntity)
    private readonly loanRequestRepo: Repository<LoanRequestEntity>,
    @InjectRepository(Tool)
    private readonly toolRepo: Repository<Tool>,
  ) {}

  async findAll(toolId?: string): Promise<LoanRequestEntity[]> {
    const query = this.loanRequestRepo.createQueryBuilder('loanRequest')
      .leftJoinAndSelect('loanRequest.tool', 'tool');

    if (toolId && toolId !== 'all') {
      query.andWhere('tool.id = :toolId OR tool.name = :toolId', { toolId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<LoanRequestEntity> {
    const request = await this.loanRequestRepo.findOne({
      where: { id },
      relations: ['tool'],
    });

    if (!request) {
      throw new NotFoundException(`no se encontro la solicitud con id ${id}`);
    }

    return request;
  }

  async create(createDto: CreateLoanRequestDto): Promise<LoanRequestEntity> {
    const tool = await this.toolRepo.findOne({ where: { id: createDto.toolId } });
    
    if (!tool) {
      throw new NotFoundException('esa herramienta no existe');
    }

    
    if (createDto.days > tool.maxLimit) {
      throw new BadRequestException(`los dias solicitados (${createDto.days}) superan el limite máximo que hay para esta herramienta unu:(${tool.maxLimit} dias).`);
    }

    const newRequest = this.loanRequestRepo.create({
      purpose: createDto.purpose,
      days: createDto.days,
      tool,
    });

    return this.loanRequestRepo.save(newRequest);
  }
}