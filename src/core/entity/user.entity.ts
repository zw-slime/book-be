import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PictureEntity } from './picture.entity';

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

  @Column({
    name: 'create_at',
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @OneToMany(type => PictureEntity, picture => picture.owner)
  pictures: PictureEntity[];
}
