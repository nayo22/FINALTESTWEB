import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LoanRequest, LoanRequestEntity } from './loan-request.entity';

@Entity('tools')
export class Tool {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  maxLimit!: number;

  @OneToMany(() => LoanRequest, (loanRequest) => LoanRequestEntity.tool)
  loanRequests!: LoanRequest[];
}