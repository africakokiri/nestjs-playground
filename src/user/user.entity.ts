import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Roles {
  'USER' = 'USER',
  'ADMIN' = 'ADMIN',
}

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  nickname: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(Roles),
    default: Roles.USER,
  })
  role: Roles;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
