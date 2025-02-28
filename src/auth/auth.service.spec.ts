import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module'; // Adjust the import path as necessary
import { CryptoService } from '../utils/securiityutils/crypto-service.util';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let app: INestApplication;
  let authService: AuthService;
  let cryptoService: CryptoService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    cryptoService = moduleFixture.get<CryptoService>(CryptoService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createUser   (input: {
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

      console.log('Created User Response:', response.body.data.createUser);
      expect(response.body.data.createUser).toBeDefined();
      expect(response.body.data.createUser.email).toEqual("juants@example.com");
    });
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              login(email: "juants@example.com", password: "securepassword") {
                access_token
              }
            }
          `,
        })
        .expect(200);

      console.log('Login Response:', response.body.data.login);
      expect(response.body.data.login).toBeDefined();
      expect(response.body.data.login.access_token).toBeTruthy(); // Check that a token is returned
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              login(email: "test@example.com", password: "wrongPassword") {
                access_token
              }
            }
          `,
        })
        .expect(200); // Expecting a 200 response, but the token should be null or undefined

      console.log('Invalid Login Response:', response.body);
      expect(response.body.errors).toBeDefined(); // Check that an error is returned
      expect(response.body.errors[0].message).toEqual('Invalid credentials'); // Adjust based on your error handling
    });
  });

  // Tests for CryptoService
  describe('CryptoService', () => {
    it('should hash a password', async () => {
      const password = 'securepassword';
      const hashedPassword = await cryptoService.hashPassword(password);
      console.log('Hashed Password:', hashedPassword);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(password); // Ensure the hashed password is not the same as the original
    });

    it('should compare passwords correctly', async () => {
      const password = 'securepassword';
      const hashedPassword = await cryptoService.hashPassword(password);
      const isMatch = await cryptoService.comparePassword(password, hashedPassword);
      console.log('Password Match:', isMatch); // Should be true
      expect(isMatch).toBe(true); // Should return true for matching passwords
    });

    it('should return false for incorrect password comparison', async () => {
      const password = 'securepassword';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await cryptoService.hashPassword(password);
      const isMatch = await cryptoService.comparePassword(wrongPassword, hashedPassword);
      console.log('Incorrect Password Match:', isMatch); // Should be false
      expect(isMatch).toBe(false); // Should return false for non-matching passwords
    });
  });
});