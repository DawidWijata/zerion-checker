FROM node:24-slim AS base

RUN corepack enable
COPY . /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN npx playwright install --with-deps chromium --only-shell

COPY . .
CMD ["npm", "run", "start:docker"]
