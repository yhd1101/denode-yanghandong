import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InventoryHistoryService } from './inventory-history.service';
import { CreateInventoryHistoryDto } from './dto/create-inventory-history.dto';
import { UpdateInventoryHistoryDto } from './dto/update-inventory-history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUserInterface } from 'src/auth/requestWithUser.interface';

@Controller('inventory-history')
@ApiTags('Inventory History')
export class InventoryHistoryController {
  constructor(private readonly inventoryHistoryService: InventoryHistoryService) {}

  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '입출고 히스토리',
    description: '제품 입출고 히스토리를 조회합니다. 각 기록에는 입출고된 수량(quantity), 유통기한(expirationDate), 입출고 타입(IN/OUT), 기록 생성자(createdBy), 해당 시점의 전체 재고 수량(stockAfter)이 포함됩니다.'
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 401, description: '권한없음'})
  async getAllInventoryHistory(@Req() req: RequestWithUserInterface) {
    const myHistory = await this.inventoryHistoryService.getAllInventoryHistory(req.user);
    return myHistory;
  }
}
