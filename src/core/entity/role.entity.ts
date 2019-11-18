import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './index';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    unique: true,
    enum: ['admin', 'user', 'visitor'],
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  nameCn: string;

  @OneToMany(type => UserEntity, user => user.role)
  users: UserEntity[];
}
