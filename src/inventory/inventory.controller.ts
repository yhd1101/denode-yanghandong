import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUserInterface } from 'src/auth/requestWithUser.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { Inventory } from './entities/inventory.entity';

@Controller('inventory')
@ApiTags('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('inbound')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createInboundInventory(@Body() createInventoryDto: CreateInventoryDto, @Req() req: RequestWithUserInterface ) {
    const inboundInventory = await this.inventoryService.createInboundInventory(createInventoryDto, req.user);
    return inboundInventory
  }

  @Post('outbount')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createOutboundInvetory(@Body() createInventoryDto: CreateInventoryDto, @Req() req: RequestWithUserInterface) {
    const outboundInventory = await this.inventoryService.createOutboundInventory(createInventoryDto, req.user) 
    return outboundInventory;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getAllInventory(@Req() req: RequestWithUserInterface, @Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<Inventory>> {
    return await this.inventoryService.getAllInventory(pageOptionsDto, req.user);
  }
}
