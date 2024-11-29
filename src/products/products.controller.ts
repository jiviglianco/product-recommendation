import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() products: CreateProductDto[]) {
    await this.productsService.createProducts(products);
    return { message: 'Products added to Pinecone successfully' };
  }

  @Get('similar/:productId')
  async getSimilarProducts(@Param('productId') productId: string) {
    const similarProducts = await this.productsService.findSimilarProducts(productId);
    return similarProducts;
  }
}