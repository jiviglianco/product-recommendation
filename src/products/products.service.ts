import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { PineconeService } from './../pinecone/pinecone.service';

@Injectable()
export class ProductsService {
  constructor(private readonly pineconeService: PineconeService) {}

  async createProducts(products: CreateProductDto[]) {
    const vectors = await Promise.all(
      products.map(async (product) => {
        const vector = await this.pineconeService.convertProductToVector(product);

        
        return {
          id: product.id,
          values: vector,
          metadata: {
            name: product.name,
            description: product.description,
            tags: product.tags,
          },
        };
      }),
    );

    await this.pineconeService.upsertProductsToPinecone(vectors);
  }

  async findSimilarProducts(productId: string) {
    const productVector = await this.pineconeService.getProductVectorById(productId);

    const similarProducts = await this.pineconeService.querySimilarProducts(productId, productVector);

    return similarProducts;
  }

}
