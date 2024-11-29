// src/pinecone/pinecone.service.ts
import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class PineconeService {
  private readonly pineconeClient: Pinecone;
  private readonly indexName: string = 'product-recommendations'; 

  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('PINECONE_API_KEY');
    this.pineconeClient = new Pinecone({
      apiKey,
    });

    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async convertProductToVector(product: any): Promise<number[]> {
    const text = `${product.name} ${product.description}`; 

    const embedding = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text, 
    });

    return embedding.data[0].embedding; 
  }

  async upsertProductsToPinecone(vectors: any[]) {
    const index = this.pineconeClient.index(this.indexName);

    await index.namespace('ns1').upsert(vectors);
  }

  async querySimilarProducts(productId: string, queryVector: number[], topK: number = 5) {
    const index = this.pineconeClient.index(this.indexName);

    const response = await index.namespace('ns1').query({
      topK,
      vector: queryVector,
      includeValues: true,
      includeMetadata: true,
    });

    const filteredMatches = response.matches.filter((match) => match.id !== productId);
    const recommendations = filteredMatches.map((match) => ({
      productId: match.id,
      score: parseFloat(match.score.toFixed(2)),
    }));

    return { recommendations };
  }

  async getProductVectorById(productId: string): Promise<number[]> {
    const index = this.pineconeClient.index(this.indexName);

    
    const response = await index.namespace('ns1').fetch([productId]);

    if (response && response.records && response.records[productId].values.length > 0) {
      
      return response.records[productId].values;
    } else {
      throw new Error(`Product with ID ${productId} not found`);
    }
  }
}
