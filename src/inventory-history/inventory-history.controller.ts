import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InventoryHistoryService } from './inventory-history.service';
import { CreateInventoryHistoryDto } from './dto/create-inventory-history.dto';
import { UpdateInventoryHistoryDto } from './dto/update-inventory-history.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUserInterface } from 'src/auth/requestWithUser.interface';

@Controller('inventory-history')
export class InventoryHistoryController {
  constructor(private readonly inventoryHistoryService: InventoryHistoryService) {}

  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getAllInventoryHistory(@Req() req: RequestWithUserInterface) {
    const myHistory = await this.inventoryHistoryService.getAllInventoryHistory(req.user);
    return myHistory;
  }
}
