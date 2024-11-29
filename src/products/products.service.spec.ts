import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PineconeService } from '../pinecone/pinecone.service';
import { CreateProductDto } from './dto/createProduct.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let pineconeService: PineconeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PineconeService,
          useValue: {
            upsertProductsToPinecone: jest.fn().mockResolvedValue(true),
            convertProductToVector: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
            getProductVectorById: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
            querySimilarProducts: jest.fn().mockResolvedValue({
              recommendations: [
                { productId: 'product-2', score: 0.95 },
              ],
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    pineconeService = module.get<PineconeService>(PineconeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create products and call Pinecone service', async () => {
    const products: CreateProductDto[] = [
      { id: 'product-1', name: 'Smartphone A', description: 'A high-end smartphone', tags: ['electronics'] },
    ];
    const expectedPayload = [
      {
        id: 'product-1',
        metadata: {
          description: 'A high-end smartphone',
          name: 'Smartphone A',
          tags: ['electronics'],
        },
        values: [0.1, 0.2, 0.3],
      },
    ];

    await service.createProducts(products);

    expect(pineconeService.upsertProductsToPinecone).toHaveBeenCalledWith(expectedPayload);
  });

  it('should find similar products', async () => {
    const similarProducts = await service.findSimilarProducts('product-1');

    expect(similarProducts.recommendations.length).toBeGreaterThan(0);
    expect(similarProducts.recommendations[0].productId).toBe('product-2');
  });
});
