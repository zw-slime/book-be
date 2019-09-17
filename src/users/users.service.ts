import { Injectable } from '@nestjs/common';
import { readJson } from '../tools/read-json';
import { BadRequestException } from '../common/exception/http-exception';
import { User } from '../core/model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async findOneByUserName(username): Promise<User> {
    const data = readJson('/datas/user.json');
    if (data.err) {
      throw new BadRequestException(data.err.message);
    }

    return data.result.data.find(v => v.username === username);
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
