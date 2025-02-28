<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest] framework TypeScript starter repository.


![alt text](https://github.com/autJuanaura/nst_ap_gph/blob/master/collections/.collections/.98765434567.png)

## Project setup

```bash
$ npm install
```
``` Tree
/your-nestjs-app
│
├── /src
│   ├── /products
│   │   ├── products.module.ts          # Module file for products
│   │   ├── products.service.ts         # Service file for products
│   │   ├── products.resolver.ts        # Resolver file for products
│   │   ├── product.dto.ts              # DTO file for product
│   │   └── ...                         # Other product-related files
│   ├── /auth
│   ├── /categories
│   ├── /orders
│   ├── /users
│   └── app.module.ts                   # Main application module
│
├── /test
│   ├── app.e2e-spec.ts                 # Main E2E test file
│   ├── products.e2e-spec.ts            # E2E test file for products
│   └── jest-e2e.json                   # Jest configuration for E2E tests
│
├── package.json
└── tsconfig.json

```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation]for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation] to learn more about the framework.
- For questions and support, please visit our [Discord channel]
- To dive deeper and get more hands-on experience, check out our official video [courses]
- Deploy your application to AWS with the help of [NestJS Mau] in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools]
- Need help with your project (part-time to full-time)? Check out our official 

## Docker Development Setup

To build and run the application in a development environment using Docker, use the following commands:

```bash
docker build -t your-app-name:development --target development .
docker run -p 3000:3000 your-app-name:development

## License
@author:[@JuanTous]
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
