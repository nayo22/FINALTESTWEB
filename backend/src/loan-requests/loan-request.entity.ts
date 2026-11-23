import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tool } from './tool.entity';

@Entity('loan_requests')
export class LoanRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  purpose!: string;

  @Column()
  days!: number;

  @ManyToOne(() => Tool, (tool) => tool.loanRequests, { eager: true, onDelete: 'CASCADE' })
  tool!: Tool;
}