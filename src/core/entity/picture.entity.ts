import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'picture' })
export class PictureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => UserEntity, user => user.pictures)
  @JoinColumn()
  owner: UserEntity;

  @Column({
    nullable: false,
  })
  bucketName: string;

  @Column({
    nullable: false,
    unique: true,
  })
  fileName: string;

  @Column({
    nullable: false,
  })
  fileType: string;

  @Column({
    default: '',
  })
  originName: string;

  @Column({
    default: false,
  })
  isPublic: boolean;
}
