import { InputType, Field, Int } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryInput } from './create-category.input';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
    @Field(() => Int)
    id: number;
}