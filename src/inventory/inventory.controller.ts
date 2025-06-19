import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUserInterface } from 'src/auth/requestWithUser.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CreateOutInventoryDto } from './dto/create-out-inventory.dto';

@Controller('inventory')
@ApiTags('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('/inbound')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '제품 입고',
    description: '제품을 입고해주는 api입니다 product를 조회해서 해당 productid를 입력하세요 또한 유통기한 없으면 지우고 생략가능'
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '입고 성공' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @ApiResponse({ status: 401, description: '권한없음'})
  @ApiResponse({ status: 404, description: '제품을 찾을 수 없습니다'})
  async createInboundInventory(@Body() createInventoryDto: CreateInventoryDto, @Req() req: RequestWithUserInterface ) {
    const inboundInventory = await this.inventoryService.createInboundInventory(createInventoryDto, req.user);
    return inboundInventory
  }

  @Post('/outbound')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '제품 출고',
    description: ' 지정한 제품 ID의 재고를 출고합니다. 유통기한 빠른 순으로 차감'
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '출고 성공' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @ApiResponse({ status: 401, description: '권한없음'})
  @ApiResponse({ status: 404, description: '제품을 찾을 수 없습니다'})
  async createOutboundInvetory(@Body() createOutInventoryDto: CreateOutInventoryDto, @Req() req: RequestWithUserInterface) {
    const outboundInventory = await this.inventoryService.createOutboundInventory(createOutInventoryDto, req.user) 
    return outboundInventory;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '보유 재고 조회',
    description: 
      '제품별 보유 재고를 조회합니다.\n' +
      '유통기한이 빠른 순(ASC) 또는 늦은 순(DESC)으로 정렬할 수 있습니다.\n' +
      '페이지와 사이즈를 지정하여 페이지 단위로 조회할 수 있습니다.\n' +
      '유통기한이 없는 재고도 함께 포함됩니다.'
  })  
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '보유재고 조회' })
  @ApiResponse({ status: 401, description: '권한없음'})
  async getAllInventory(@Req() req: RequestWithUserInterface, @Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Inventory>> {
    return await this.inventoryService.getAllInventory(pageOptionsDto, req.user);
  }
}
