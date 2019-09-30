import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../core/entity';
import { CreateMD5 } from '../../../tools/createMD5';
import { UserValidator } from '../../../core/class-validator';
import { User } from '../../../core/model';

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
    return this.userRepository.find({ relations: ['pictures'] });
  }

  async addUser(param: UserValidator) {
    const salt = this.createSalt();
    const password = CreateMD5(param.password, salt);

    return this.userRepository.save({
      name: param.name,
      email: param.email,
      password,
      salt,
    });
  }

  async updateUser(params: User) {
    const salt = this.createSalt();
    const password = CreateMD5(params.password, salt);

    return this.userRepository.update(
      { id: params.id },
      { ...params, salt, password },
    );
  }

  createSalt() {
    return Math.random()
      .toString(36)
      .substr(2);
  }
}
