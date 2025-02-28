import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductsResolver (e2e)', () => {
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

    it('should return all products', async () => {
        const query = `
      query {
        getProducts {
          id
          name
          price
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200);

        expect(response.body.data.getProducts).toBeDefined();
        expect(Array.isArray(response.body.data.getProducts)).toBe(true);
    });

    it('should return a single product by id', async () => {
        const query = `
      query {
        getProduct(id: 1) {
          id
          name
          price
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200);

        expect(response.body.data.getProduct).toBeDefined();
        expect(response.body.data.getProduct.id).toBe(1);
    });

    it('should return null for a non-existing product', async () => {
        const query = `
      query {
        getProduct(id: 999) {
          id
          name
          price
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200);

        expect(response.body.data.getProduct).toBeNull();
    });
});