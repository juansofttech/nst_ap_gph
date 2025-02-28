import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { generateMultipleFakeUsers } from '../../utils/factories/user.factory'; // Adjust the import path as necessary

/**
 * Author: [@JuanManuel]
 * Date: [2014] 025-02-[W're]
 * Description: Mutations,and Sbscr
 * [500L]
 * 
 */
describe('Users GraphQL', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should get all users', async () => {
        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                    query {
                        getUsers {
                            id
                            email
                            firstName
                            lastName
                            city
                            country
                            phoneNumber
                            latitude
                            longitude
                        }
                    }
                `,
            })
            .expect(200);

        expect(response.body.data.getUsers).toBeDefined();
        expect(Array.isArray(response.body.data.getUsers)).toBe(true);
    });


    // [@author:JTs]

    it('should get a user by ID', async () => {
        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                    query {
                        getUser  (id: 1) {
                            id
                            email
                            firstName
                            lastName
                            city
                            country
                            phoneNumber
                            latitude
                            longitude
                        }
                    }
                `,
            })
            .expect(200);

        expect(response.body.data.getUser).toBeDefined();
        expect(response.body.data.getUser.id).toEqual(1);
    });

    it('should create a new user', async () => {
        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createUser  (input: {
                            email: "juants@example.com",
                            password: "securepassword",
                            firstName: "Juan",
                            lastName: "Tous",
                            city: "Med",
                            country: "Col",
                            phoneNumber: "3104776764",
                            latitude: 40.7128,
                            longitude: -74.0060
                        }) {
                            id
                            email
                            firstName
                            lastName
                            city
                            country
                            phoneNumber
                            latitude
                            longitude
                        }
                    }
                `,
            })
            .expect(200);

        expect(response.body.data.createUser).toBeDefined();
        expect(response.body.data.createUser.email).toEqual("juants@example.com");
    });

    it('should create multiple users', async () => {
        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createMultipleUsers(createMultipleUsersData: {
                            users: [
                                {
                                    email: "user1@example.com",
                                    password: "password1",
                                    firstName: "User  ",
                                    lastName: "One",
                                    city: "New York",
                                    country: "USA",
                                    phoneNumber: "1234567890",
                                    latitude: 40.7128,
                                    longitude: -74.0060
                                },
                                {
                                    email: "user2@example.com",
                                    password: "password2",
                                    firstName: "User  ",
                                    lastName: "Two",
                                    city: "Los Angeles",
                                    country: "USA",
                                    phoneNumber: "0987654321",
                                    latitude: 34.0522,
                                    longitude: -118.2437
                                },
                                {
                                    email: "nancy-valley@example.com",
                                    password: "password3",
                                    firstName: "Juan  ",
                                    lastName: "Tous",
                                    city: "MED",
                                    country: "COL",
                                    phoneNumber: "1122334455",
                                    latitude: 51.5074,
                                    longitude: -0.1278
                                }
                            ]
                        }) {
                            id
                            email
                            firstName
                            lastName
                            city
                            country
                            phoneNumber
                            latitude
                            longitude
                        }
                    }
                `,
            })
            .expect(200);

        expect(response.body.data.createMultipleUsers).toBeDefined();
        expect(response.body.data.createMultipleUsers.length).toBe(3);
    });


    it('the user factory should create multiple users.', async () => {
        const numberOfUsers = 50;
        const fakeUsers = generateMultipleFakeUsers(numberOfUsers);

        const usersInput = fakeUsers.map(user => `
            {
                email: "${user.email}",
                password: "${user.password}",
                firstName: "${user.firstName}",
                lastName: "${user.lastName}",
                city: "${user.city}",
                country: "${user.country}",
                phoneNumber: "${user.phoneNumber}",
                latitude: ${user.latitude},
                longitude: ${user.longitude}
            }
        `).join(', ');

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createMultipleUsers(createMultipleUsersData: {
                            users: [${usersInput}]
                        }) {
                            id
                            email
                            firstName
                            lastName
                            city
                            country
                            phoneNumber
                            latitude
                            longitude
                        }
                    }
                `,
            });

        const createdUsers = response.body.data.createMultipleUsers;
        console.log('Created Users:', JSON.stringify(createdUsers, null, 2));

        expect(response.status).toBe(200);
        expect(createdUsers).toBeDefined();
        expect(createdUsers.length).toBe(numberOfUsers);
    });


    it('should create multiple users from Json file', async () => {
        console.log('Current working directory:', process.cwd());

        const usersFilePath = path.resolve(__dirname, '../../../.datatest/.user-data/users.json');
        console.log('Resolved users file path:', usersFilePath);

        // debug mode
        if (!fs.existsSync(usersFilePath)) {
            throw new Error(`File not found: ${usersFilePath}`);
        }

        let usersData;
        try {
            const jsonString = fs.readFileSync(usersFilePath, 'utf-8');
            usersData = JSON.parse(jsonString);
            console.log('Users data:', usersData);
        } catch (error) {
            throw new Error(`Error reading or parsing users.json: ${error.message}`);
        }

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                mutation {
                    createMultipleUsers(createMultipleUsersData: {
                        users: ${JSON.stringify(usersData.users).replace(/"([^"]+)":/g, '$1:')}
                    }) {
                        id
                        email
                        firstName
                        lastName
                        city
                        country
                        phoneNumber
                        latitude
                        longitude
                    }
                }
            `,
            });

        console.log('Response body:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.createMultipleUsers).toBeDefined();
        expect(response.body.data.createMultipleUsers.length).toBe(usersData.users.length);
    });



    // ...[@JuanTous][RM FROM JSON F 10% ---------------------------------------------

    it.only('should delete multiple users from Json file', async () => {
        console.log('Current working directory:', process.cwd());

        // Construct the path to the users.json file
        const usersFilePath = path.resolve(__dirname, '../../../.datatest/.user-data/users.json');
        console.log('Resolved users file path:', usersFilePath);

        // Check if the file exists
        if (!fs.existsSync(usersFilePath)) {
            throw new Error(`File not found: ${usersFilePath}`);
        }

        let usersData;
        try {
            // Read and parse the JSON file
            const jsonString = fs.readFileSync(usersFilePath, 'utf-8');
            usersData = JSON.parse(jsonString);
            console.log('Users data before deletion:', usersData);
        } catch (error) {
            throw new Error(`Error reading or parsing users.json: ${error.message}`);
        }

        // Make the GraphQL request to delete multiple users
        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                mutation {
                    deleteMultipleUsers(userIds: [${usersData.users.map(user => `"${user.id}"`).join(', ')}]) {
                        id
                        email
                    }
                }
            `,
            });

        // Log the response body for debugging
        console.log('Response body after deletion:', response.body);

        // Assertions
        expect(response.status).toBe(200); // Expect a 200 OK response
        expect(response.body.data.deleteMultipleUsers).toBeDefined();
        expect(response.body.data.deleteMultipleUsers.length).toBe(usersData.users.length); // Expect the number of deleted users to match the original count

        // Verify that the users.json file is now empty
        const updatedUsersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        expect(updatedUsersData.users.length).toBe(0); // Ensure the file is empty
    });



});