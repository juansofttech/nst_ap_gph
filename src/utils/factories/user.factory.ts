import { faker } from '@faker-js/faker';
import { CreateUserInput } from '../../users/dtos/create-user.input';

const generateRandomLatitude = (): number => {
    return parseFloat((Math.random() * 180 - 90).toFixed(6)); // Latitude ranges from -90 to 90
};

const generateRandomLongitude = (): number => {
    return parseFloat((Math.random() * 360 - 180).toFixed(6)); // Longitude ranges from -180 to 180
};

export const generateFakeUser = (): CreateUserInput => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        city: faker.location.city(),
        country: faker.location.country(),
        phoneNumber: faker.phone.number(),
        latitude: generateRandomLatitude(),
        longitude: generateRandomLongitude(),
    };
};

export const generateMultipleFakeUsers = (count: number): CreateUserInput[] => {
    return Array.from({ length: count }, () => generateFakeUser());
};