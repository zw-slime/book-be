import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDTO } from '../core/model';
import { CreateMD5 } from '../tools/createMD5';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findOneByUserName(username): Promise<UserEntity> {
    return this.userRepository.findOne({ name: username });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async addUser(param: UserDTO) {
    const salt = Math.random()
      .toString(36)
      .substr(2);
    const password = CreateMD5(param.password, salt);

    return this.userRepository.save({
      name: param.name,
      email: param.email,
      password,
      salt,
    });
  }
}
