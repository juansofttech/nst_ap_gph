import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dtos/create-user.input'; // Import CreateUser  Input

export type User = {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    city?: string;
    country?: string;
    phoneNumber?: string;
    latitude?: number;
    longitude?: number;
};

@Injectable()
export class UsersService {
    private readonly users: User[] = [];

    constructor() {
        // You can initialize users here without hashing
        this.users.push(
            { id: 1, email: 'john@example.com', password: 'changeme', firstName: 'John', lastName: 'Doe' },
            { id: 2, email: 'maria@example.com', password: 'guess', firstName: 'Maria', lastName: 'Smith' },
        );
    }

    async createUser(input: CreateUserInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const newUser = {
            id: this.users.length + 1,
            email: input.email,
            password: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName,
            city: input.city,
            country: input.country,
            phoneNumber: input.phoneNumber,
            latitude: input.latitude,
            longitude: input.longitude,
        };
        this.users.push(newUser);
        return newUser;
    }

    async findOneById(userId: number): Promise<User | undefined> {
        return this.users.find(user => user.id === userId);
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    async findAll(): Promise<User[]> {
        return this.users; // Return the array of users
    }



    // @Actor:[@JuanitoDR] -2025 -MD Promise<User[]> 
    // @Actor:[@JuanitoDR] -2025 -MD Promise<User[]>
    async createMultiple(users: CreateUserInput[]): Promise<User[]> {
        const createdUsers: User[] = [];
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = {
                id: this.users.length + 1,
                email: user.email,
                password: hashedPassword,
                firstName: user.firstName,
                lastName: user.lastName,
                city: user.city,
                country: user.country,
                phoneNumber: user.phoneNumber,
                latitude: user.latitude,
                longitude: user.longitude,
            };
            this.users.push(newUser);
            createdUsers.push(newUser);
        }
        return createdUsers;
    }

    async delete(id: number): Promise<User | undefined> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex > -1) {
            return this.users.splice(userIndex, 1)[0]; // Remove and return the user
        }
        return undefined;
    }
}