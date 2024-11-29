# Product Recommendation Service - Backend Challenge

## Overview

This project is a **Product Recommendation Service** built using **NestJS**, **Pinecone**, and **OpenAI**. The goal of the project is to provide product recommendations based on vector similarity. The application allows you to:

1. **Create products**: Add products with attributes like name, description, and tags.
2. **Generate product vectors**: Use OpenAI's `text-embedding-ada-002` model to generate product vectors.
3. **Store vectors in Pinecone**: Store product vectors and metadata in Pinecone for fast similarity search.
4. **Recommend similar products**: Query Pinecone to get similar products based on vector similarity.

## Features

- **Product Creation**: Add products to the system with an ID, name, description, and tags.
- **Similarity Search**: Query for products similar to a given product based on vector similarity.
- **Dynamic Vector Generation**: Use OpenAI embeddings to generate product vectors.
- **Pinecone Integration**: Use Pinecone to store and query product vectors for fast and scalable similarity searches.

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Pinecone**: A vector database for efficient similarity search and retrieval of vector embeddings.
- **OpenAI**: A powerful AI service to generate embeddings for text data using models like `text-embedding-ada-002`.
- **TypeScript**: A typed superset of JavaScript that helps in building robust and maintainable applications.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/product-recommendation-service.git
cd product-recommendation-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory and add the following variables:

```env
PINECONE_API_KEY=your-pinecone-api-key
OPENAI_API_KEY=your-openai-api-key
```

Replace your-pinecone-api-key and your-openai-api-key with your actual API keys.

### 4. Running the application locally

To run the application locally in development mode, use the following command:

```bash
npm run start:dev
```

The application will start on http://localhost:3000.

### API Endpoints
## 1. Create Products
# POST /products/

This endpoint allows you to create products. You must send an array of product objects in the request body.

Request Body:

```json
[
  {
    "id": "product-1",
    "name": "Smartphone A",
    "description": "A high-end smartphone with a 5G chip, 128GB storage, and a 6.5-inch display.",
    "tags": ["electronics", "smartphone", "5G"]
  },
  {
    "id": "product-2",
    "name": "Smartphone B",
    "description": "A budget smartphone with 4G support, 64GB storage, and a 5.0-inch display.",
    "tags": ["electronics", "smartphone", "budget"]
  }
]
```

Response:

```json
{
  "message": "Products added successfully"
}
```

## 2. Get Similar Products
# GET /products/similar/:productId

This endpoint returns similar products based on the vector similarity of a given product ID.

Example Request:

```bash
GET http://localhost:3000/products/similar/product-1
```

Response:

```json
{
  "recommendations": [
    {
      "productId": "product-2",
      "score": 0.92
    }
  ]
}
```

The response contains an array of similar products with the productId and a score indicating the similarity.

### Running Tests
To run unit tests for the service, use the following command:

```bash
npm run test
```

The tests are located in the src/products/products.service.spec.ts file.

# Example Test Cases:
- Create products and verify Pinecone call
- Query for similar products and validate response