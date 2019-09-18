import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export interface UserInfo {
  email: string;
  username: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
