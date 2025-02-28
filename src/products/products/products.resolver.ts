import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './product.dto';

@Resolver(() => Product)
export class ProductsResolver {
    constructor(private productsService: ProductsService) { }

    @Query(() => [Product])
    getProducts() {
        return this.productsService.findAll();
    }

    @Query(() => Product, { nullable: true })
    getProduct(@Args('id') id: number) {
        return this.productsService.findOne(id);
    }
}