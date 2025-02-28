FROM node:23.0.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:23.0.0 AS tester
WORKDIR /app
COPY --from=builder /app ./
RUN npm install
RUN npm test

FROM node:23.0.0 AS development
WORKDIR /app
COPY --from=builder /app ./
RUN npm install
CMD ["npm", "run", "start:dev"]

FROM node:23.0.0 AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main"]