import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class EditPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsString()
  @IsNotEmpty()
  removePhoto: string;
}
