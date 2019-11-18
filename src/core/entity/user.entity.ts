import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PictureEntity } from './picture.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  salt: string;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @OneToOne(type => RoleEntity, role => role.users)
  role: RoleEntity;

  @OneToMany(type => PictureEntity, picture => picture.owner)
  pictures: PictureEntity[];
}
