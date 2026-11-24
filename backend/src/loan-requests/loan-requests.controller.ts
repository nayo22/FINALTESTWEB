import { Controller, Get, Post, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoanRequestsService } from './loan-requests.service';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';

@Controller('loan-requests')
export class LoanRequestsController {
  constructor(private readonly loanRequestsService: LoanRequestsService) {}

  @Get()
  findAll(@Query('tool') tool?: string) {
    return this.loanRequestsService.findAll(tool);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanRequestsService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createLoanRequestDto: CreateLoanRequestDto) {
    return this.loanRequestsService.create(createLoanRequestDto);
  }
}