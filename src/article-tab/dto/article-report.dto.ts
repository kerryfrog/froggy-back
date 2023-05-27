import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReportArticleDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  articleId: number;

  @ApiProperty({ example: '욕설을 사용했습니다!!!' })
  @IsString()
  reason: string;
}
