import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoleType } from '../../shared/enums/user-role-type.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  isEmailConfirmed: boolean;

  @Column({ default: UserRoleType.RegularUser })
  role: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
