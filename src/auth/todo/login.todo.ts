import { IsNotEmpty, IsString } from 'class-validator';

export class LoginTodo {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
