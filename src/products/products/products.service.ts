// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { Product } from './product.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    return this.products.find(product => product.id === id);
  }
}