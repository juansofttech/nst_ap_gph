import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './category.dto';

@Resolver(() => Category)
export class CategoriesResolver {
    constructor(private categoriesService: CategoriesService) {}

    @Query(() => [Category])
    getCategories() {
        return this.categoriesService.findAll();
    }

    @Query(() => Category, { nullable: true })
    getCategory(@Args('id') id: number) {
        return this.categoriesService.findOne(id);
    }

    @Mutation(() => Category)
    createCategory(@Args('name') name: string, @Args('description', { nullable: true }) description?: string) {
        return this.categoriesService.create(name, description);
    }
}