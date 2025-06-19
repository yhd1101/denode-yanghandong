import { Injectable } from '@nestjs/common';
import { CreateInventoryHistoryDto } from './dto/create-inventory-history.dto';
import { UpdateInventoryHistoryDto } from './dto/update-inventory-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryHistory } from './entities/inventory-history.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class InventoryHistoryService {
  constructor(
    @InjectRepository(InventoryHistory)
    private readonly inventoryHistoryRepository: Repository<InventoryHistory>,
  ){}

  async getAllInventoryHistory(user: User) {
    return await this.inventoryHistoryRepository.find({
      where: { createdBy: { id: user.id } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }
  
}
