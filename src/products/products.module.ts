import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PineconeService } from 'src/pinecone/pinecone.service';

@Module({
  providers: [ProductsService,
    PineconeService
  ],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
