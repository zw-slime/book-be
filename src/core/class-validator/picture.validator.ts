import { IsNotEmpty, IsString } from 'class-validator';

export class UploadValidator {
  @IsString()
  @IsNotEmpty()
  readonly fileName: string;

  @IsNotEmpty()
  readonly file: any;
}

export class DeletePictureValidator {
  @IsString()
  @IsNotEmpty()
  readonly fileName: string;
}
