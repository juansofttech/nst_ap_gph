import { Injectable } from '@nestjs/common';
import { Category } from './category.dto';

@Injectable()
export class CategoriesService {
    private categories: Category[] = []; 
    private idCounter = 1;

    findAll(): Category[] {
        return this.categories;
    }

    findOne(id: number): Category | undefined {
        return this.categories.find(category => category.id === id);
    }

    create(name: string, description?: string): Category {
        const newCategory: Category = {
            id: this.idCounter++,
            name,
            description,
        };
        this.categories.push(newCategory);
        return newCategory;
    }
}