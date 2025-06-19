import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ValidationCodeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userEmail: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'timestamp with time zone' })
  expDate: Date;
}
