import { IsNotEmpty, IsString } from 'class-validator';

export class UserValidator {
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

export class ChangeWordValidator {
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
