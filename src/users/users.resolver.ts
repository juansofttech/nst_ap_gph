import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMultipleUsersInput } from './dtos/create-multiple-users.input'; // Import the new input type
import { CreateUserInput } from './dtos/create-user.input'; // Import CreateUser  Input
import { UpdateUser } from './dtos/update-user.input'; // Import UpdateUser  Input
import { User } from './entities/user.entity'; // Import User entity
import { UsersService } from './users.service'; // Import UsersService
import * as path from 'path'; // Import path for file path resolution
import { promises as fs } from 'fs';


@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) { }

  @Query(() => [User]) // Query to get all users
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true }) // Query to get a specific user by ID
  async getUser(@Args('id') id: number): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User  with ID ${id} not found`);
    }
    return user;
  }



  @Mutation(() => User) // Mutation to create a new user
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.createUser(input); // Pass the entire input object
  }

  @Mutation(() => [User]) // Mutation to create multiple users
  async createMultipleUsers(@Args('createMultipleUsersData') createMultipleUsersData: CreateMultipleUsersInput): Promise<User[]> {
    return this.usersService.createMultiple(createMultipleUsersData.users);
  }

  @Mutation(() => [User]) // Mutation to create users from JSON file [Progress::::]
  async createUsersFromJson(): Promise<User[]> {
    const filePath = path.join(__dirname, 'data', 'users.json'); // Adjust the path based on where you placed the file
    const data = await fs.readFile(filePath, 'utf-8');
    const { users } = JSON.parse(data);
    return this.usersService.createMultiple(users);
  }

  @Mutation(() => User) // Mutation to update a user
  async updateUser(@Args('input') update: UpdateUser): Promise<User> {
    const user = await this.usersService.findOneById(update.id);
    if (!user) {
      throw new NotFoundException(`User  with ID ${update.id} not found`);
    }
    Object.assign(user, update);
    return user; // You might want to save the updated user back to the database
  }

  @Mutation(() => User) // Mutation to delete a user by ID
  async deleteUser(@Args('id') id: number): Promise<User> {
    const deletedUser = await this.usersService.delete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User  with ID ${id} not found`);
    }
    return deletedUser; // Return the deleted user
  }


  /*
  @Subscription(() => [User ], { name: 'usersDeleted' }) // Subscription for deleted users
  usersDeleted() {
    return pubSub.asyncIterator('usersDeleted');
  }
  
  */
}