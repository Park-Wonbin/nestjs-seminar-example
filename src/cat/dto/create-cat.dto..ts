import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ required: true })
  @IsString()
  @MaxLength(10)
  name: string;

  @ApiProperty({ required: true })
  @IsInt()
  userId: number;
}
