import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class CreateInventoryDto {
    @ApiProperty({
      description: '입고할 제품 ID',
      example: 'e5b62f3a-0c2d-42a3-94df-ef6c3e37c510',
    })
    @IsUUID('4', { message: '제품 ID는 UUID 형식이어야 합니다.' })
    productId: string;
  
    @ApiProperty({
      description: '입고 수량',
      example: 100,
    })
    @IsInt({ message: '수량은 정수여야 합니다.' })
    @Min(1, { message: '수량은 1 이상이어야 합니다.' })
    quantity: number;
  
    @ApiProperty({
      description: '유통기한 (nullable)',
      example: '2025-12-31',
      required: false,
    })
    @IsOptional()
    @IsDate({ message: '유통기한은 YYYY-MM-DD 형식의 날짜여야 합니다.' })
    @Type(() => Date)
    expirationDate?: Date;
  }
  