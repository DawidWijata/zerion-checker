FROM node:24-slim AS base

COPY . /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN npx playwright install --with-deps chromium
RUN apt-get install -y xauth

COPY . .
CMD ["xvfb-run", "npm", "run", "start:docker"]
