import { Module } from '@nestjs/common';
import { InventoryHistoryService } from './inventory-history.service';
import { InventoryHistoryController } from './inventory-history.controller';

@Module({
  controllers: [InventoryHistoryController],
  providers: [InventoryHistoryService],
})
export class InventoryHistoryModule {}
