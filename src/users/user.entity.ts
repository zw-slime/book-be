import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user-info' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;
}
