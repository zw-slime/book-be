import { UserEntity } from './src/users/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
const ormconfig: TypeOrmModuleOptions = {
  keepConnectionAlive: true,
  type: 'mysql',
  host: '192.168.44.90',
  port: 3305,
  username: 'root',
  password: '123456',
  database: 'book-be',
  synchronize: true,
  entities: [UserEntity],
};

export default ormconfig;
