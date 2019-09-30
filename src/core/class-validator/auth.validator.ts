import { IsNotEmpty, IsString } from 'class-validator';

export class Login {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
