import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsUUID, Min } from "class-validator";

export class CreateOutInventoryDto {
  @ApiProperty({ description: '출고할 제품 ID', example: '...' })
  @IsUUID('4', { message: '제품 ID는 UUID 형식이어야 합니다.' })
  productId: string;

  @ApiProperty({ description: '출고 수량', example: 10 })
  @IsInt({ message: '수량은 정수여야 합니다.' })
  @Min(1, { message: '수량은 1 이상이어야 합니다.' })
  quantity: number;
}