import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto, user: User) {
    const exits = await this.productRepository.findOne({
      where: {
        name :createProductDto.name,
        createdBy : {id : user.id},
      }
    })
    if (exits) {
      throw new BadRequestException('이미 동일한 이름의 제품이 존재합니다.');
    }
    const newProduct = await this.productRepository.create({
      ...createProductDto,
      createdBy: user,
    });

    await this.productRepository.save(newProduct);
    return instanceToPlain(newProduct);
  }

  async getProductByUser(user: User) {
    const myProducts = await this.productRepository.find({
      where: {createdBy : { id: user.id}},
      order: {createdAt: 'DESC'},
    });

    return instanceToPlain(myProducts);
  }
}
