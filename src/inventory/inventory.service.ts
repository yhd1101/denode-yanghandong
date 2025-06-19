import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { InventoryHistory } from 'src/inventory-history/entities/inventory-history.entity';
import { InventoryHistoryType } from 'src/inventory-history/entities/inventory-type.enum';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CreateOutInventoryDto } from './dto/create-out-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createInboundInventory(createInventoryDto: CreateInventoryDto, user: User) {
    return await this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: createInventoryDto.productId},
        lock: { mode : 'pessimistic_write'}
      });

      if(!product) {
        throw new NotFoundException('제품을 찾을 수 없습니다.');
      }

      let inventory = await manager.findOne(Inventory, {
        where: {
          product: { id: product.id },
          expirationDate: createInventoryDto.expirationDate ?? null,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (inventory) {
        inventory.quantity += createInventoryDto.quantity;
      } else {
        inventory = manager.create(Inventory, {
          product,
          quantity: createInventoryDto.quantity,
          expirationDate: createInventoryDto.expirationDate,
          createdBy: user,
        });
      }

      await manager.save(inventory);
      product.stock += createInventoryDto.quantity;
      await manager.save(product);

      const history = manager.create(InventoryHistory, {
        product,
        quantity: createInventoryDto.quantity,
        expirationDate: createInventoryDto.expirationDate,
        createdBy: user,
        type: InventoryHistoryType.IN,
        stockAfter: product.stock
      });

      await manager.save(history);

      return inventory;
    })
  }

  async createOutboundInventory(createOutInventoryDto: CreateOutInventoryDto, user: User) {
    return await this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: createOutInventoryDto.productId },
        lock: { mode: 'pessimistic_write' },
      });
  
      if (!product) {
        throw new NotFoundException('제품을 찾을 수 없습니다.');
      }
  
      if (product.stock < createOutInventoryDto.quantity) {
        throw new BadRequestException('재고가 부족합니다.');
      }
  
      let remaining = createOutInventoryDto.quantity;
  
      const inventories = await manager.find(Inventory, {
        where: { product: { id: product.id } },
        order: {
          expirationDate: 'ASC',
          createdAt: 'ASC',
        },
        lock: { mode: 'pessimistic_write' },
      });
  
      let lastUsedInventory: Inventory | null = null;
  
      for (const inventory of inventories) {
        if (remaining === 0) break;
  
        const deduct = Math.min(remaining, inventory.quantity);
        inventory.quantity -= deduct;
        remaining -= deduct;
  
        await manager.save(inventory);
        lastUsedInventory = inventory;

        product.stock -= createOutInventoryDto.quantity;
        const history = manager.create(InventoryHistory, {
          product,
          quantity: deduct,
          expirationDate: inventory.expirationDate,
          createdBy: user,
          type: InventoryHistoryType.OUT,
          stockAfter: product.stock
        });
  
        await manager.save(history);
      }
  
      if (remaining > 0) {
        throw new BadRequestException('출고 가능한 재고가 충분하지 않습니다.');
      }
  

      await manager.save(product);
  
      return lastUsedInventory; // 마지막으로 차감한 재고 1건 반환
    });
  }
  

  async getAllInventory(pageOptionsDto: PageOptionsDto, user: User) {
    const queryBuilder = await this.inventoryRepository.createQueryBuilder('inventory');
    queryBuilder.leftJoinAndSelect('inventory.product','product');

    await queryBuilder
      .orderBy('inventory.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.size);
    
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto});

    return new PageDto(entities, pageMetaDto);
  }
  
}
