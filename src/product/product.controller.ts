import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUserInterface } from 'src/auth/requestWithUser.interface';

@Controller('products')
@ApiTags('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createProduct(@Req() req: RequestWithUserInterface, @Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productService.createProduct(createProductDto, req.user);
    return newProduct;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getMyProducts(@Req() req: RequestWithUserInterface) {
    const myProducts = await this.productService.getProductByUser(req.user);
    return myProducts;
  }
}
