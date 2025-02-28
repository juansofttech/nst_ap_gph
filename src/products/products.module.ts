import { Module } from '@nestjs/common';
import { ProductsService } from './products/products.service';
import { ProductsResolver } from './products/products.resolver';

@Module({
  providers: [ProductsService, ProductsResolver]
})
export class ProductsModule {}
