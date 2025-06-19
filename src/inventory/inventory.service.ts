import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
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
        throw new NotFoundException('Product no found');''
      }

      let inventory = await manager.findOne(Inventory, {
        where: { product: { id : product.id}},
        lock: { mode: 'pessimistic_write'},
      });

      if (inventory) {
        inventory.quantity += createInventoryDto.quantity;
        if (createInventoryDto.expirationDate) {
          inventory.expirationDate = createInventoryDto.expirationDate;
        }
      } else {
        inventory = manager.create(Inventory, {
          product,
          quantity: createInventoryDto.quantity,
          expirationDate: createInventoryDto.expirationDate,
          createdBy: user
        });
      }

      await manager.save(inventory);

      const history = manager.create(InventoryHistory, {
        product,
        quantity: createInventoryDto.quantity,
        expirationDate: createInventoryDto.expirationDate,
        createdBy: user,
        type: InventoryHistoryType.IN,
      });

      await manager.save(history);

      return inventory;
    })
  }

  async createOutboundInventory(createInventoryDto: CreateInventoryDto, user: User) {
    return await this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: createInventoryDto.productId },
        lock: { mode: 'pessimistic_write' },
      });
  
      if (!product) {
        throw new NotFoundException('Product not found');
      }
  
      const inventory = await manager.findOne(Inventory, {
        where: { product: { id: product.id } },
        lock: { mode: 'pessimistic_write' },
      });
  
      if (!inventory || inventory.quantity < createInventoryDto.quantity) {
        throw new BadRequestException('Not enough inventory to fulfill the request');
      }
  
      inventory.quantity -= createInventoryDto.quantity;
  
      await manager.save(inventory);
  
      const history = manager.create(InventoryHistory, {
        product,
        quantity: createInventoryDto.quantity,
        expirationDate: createInventoryDto.expirationDate,
        createdBy: user,
        type: InventoryHistoryType.OUT,
      });
  
      await manager.save(history);
  
      return inventory;
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
