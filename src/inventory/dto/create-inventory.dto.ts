import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class CreateInventoryDto {
    @ApiProperty({
      description: '입고할 제품 ID',
      example: 'e5b62f3a-0c2d-42a3-94df-ef6c3e37c510',
    })
    @IsUUID()
    productId: string;
  
    @ApiProperty({
      description: '입고 수량',
      example: 100,
    })
    @IsInt()
    @Min(1)
    quantity: number;
  
    @ApiProperty({
      description: '유통기한 (nullable)',
      example: '2025-12-31',
      required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    expirationDate?: Date;
  }
  