import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('Rate Limiting (e2e)', () => {
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

    it('should allow the first 10 requests', async () => {
        for (let i = 0; i < 10; i++) {
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
        }
    });

    it('should return 429 for the 11th request', async () => {
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
            });

        expect(response.status).toBe(429); // Too Many Requests
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain('Too many requests'); // Adjust based on your error message
    });

    it('should allow requests after the rate limit resets', async () => {
        // Wait for the TTL to expire (60 seconds in this case)
        await new Promise(resolve => setTimeout(resolve, 61000));

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
});