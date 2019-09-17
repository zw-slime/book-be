import { IsInt, IsString } from 'class-validator';

export interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
}

export class CreateCatDto {
  @IsString()
  readonly name: string;
  @IsInt()
  readonly age: number;
  @IsString()
  readonly breed: string;
}

export class DeleteCatDto {
  @IsInt()
  readonly id: number;
}
