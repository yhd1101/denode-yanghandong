import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUserInterface } from 'src/auth/requestWithUser.interface';

@Controller('products')
@ApiTags('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '제품 등록',
    description: '제품 등록하는 api입니다 unit은 enum 형태이고 개, 팩, 박스, 병 4개중 입력해주시면 됩니다'
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '제품등록' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @ApiResponse({ status: 401, description: '권한없음'})
  async createProduct(@Req() req: RequestWithUserInterface, @Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productService.createProduct(createProductDto, req.user);
    return newProduct;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '제품 조회',
    description: '유저가 등록한 제품 목록을 볼수있는 api입니다'
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '제품조회' })
  @ApiResponse({ status: 401, description: '권한없음'})
  async getMyProducts(@Req() req: RequestWithUserInterface) {
    const myProducts = await this.productService.getProductByUser(req.user);
    return myProducts;
  }
}
