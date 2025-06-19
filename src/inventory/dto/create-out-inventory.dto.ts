import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsUUID, Min } from "class-validator";

export class CreateOutInventoryDto {
  @ApiProperty({ description: '출고할 제품 ID', example: '...' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: '출고 수량', example: 10 })
  @IsInt()
  @Min(1)
  quantity: number;
}