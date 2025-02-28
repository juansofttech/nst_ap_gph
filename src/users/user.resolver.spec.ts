import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module'; // Adjust the path as necessary
import { generateMultipleFakeUsers } from '../utils/factories/user.factory'; // Adjust the import path as necessary

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
                            email: "juan.tous@example.com",
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
        const fakeUsers = generateMultipleFakeUsers(150); // Generate 1B fake users [W're] 

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        createMultipleUsers(createMultipleUsersData: {
                            users: ${JSON.stringify(fakeUsers)}
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
        expect(response.body.data.createMultipleUsers.length).toBe(150);
    });

    it('should delete a user by ID', async () => {
        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: `
                    mutation {
                        deleteUser  (id: 1) {
                            id
                            email
                            latitude
                            longitude
                        }
                    }
                `,
            })
            .expect(200);

        expect(response.body.data.deleteUser).toBeDefined();
        expect(response.body.data.deleteUser.id).toEqual(1);
    });
});