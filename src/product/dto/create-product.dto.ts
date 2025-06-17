import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Unit } from '../entities/unit.enum';

export class CreateProductDto {
  @ApiProperty({
    description: '제품 이름 (예: 국소마취제, 치실, 니들 팩 등)',
    example: '국소마취제',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: '제품 단위 (수량 기준 단위)',
    example: Unit.PACK,
    enum: Unit,
    enumName: 'Unit',
  })
  @IsOptional()
  @IsEnum(Unit)
  unit?: Unit;
}
