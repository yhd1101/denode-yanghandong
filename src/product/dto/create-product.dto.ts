import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Unit } from '../entities/unit.enum';

export class CreateProductDto {
  @ApiProperty({
    description: '제품 이름 (예: 국소마취제, 치실, 니들 팩 등)',
    example: '국소마취제',
  })
  @IsString({ message: '제품은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제품을 꼭 입력해주세요.' })
  name: string;

  @ApiPropertyOptional({
    description: '제품 단위 (수량 기준 단위)',
    example: Unit.PACK,
    enum: Unit,
    enumName: 'Unit',
  })
  @IsOptional()
  @IsEnum(Unit, { message: '제품 단위는 PACK, BOX 등 Unit 열거형 중 하나여야 합니다.' })
  unit?: Unit;
}
