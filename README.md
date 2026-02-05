# Zerion Checker
Zerion Checker is a simple tool that checks if a Zerion (https://zerion.cc) media website is currently blocked for non-premium users. The tool was meant to help in planning movie dates with my wife :smile:

Checker bot logs the result to MongoDB and can be used to monitor the availability of a website, e.g. with a Grafana dashboard. You can customize the sample rate simply by setting a CRON job in your production environment.

## Demo
[Grafana dashboard](https://dawidwijata.grafana.net/public-dashboards/33f6857740d14c6e968cc7ced132e507)

## Features
- Structured logging
- Handling timeouts caused by Cloudflare verification
- Integration with MongoDB

## Setup
You can run the project with either local settings, or with docker-compose.

### Prerequisites
- [Node.js >= v22](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)
- Your own MongoDB instance if you want to use it instead of the one provided by docker-compose

### Local environment
For quicker setup, it is recommended to use docker-compose: `docker-compose up -d`.

1. Install dependencies: `npm install`
2. Copy `.env.docker` to `.env` and set environment variables in `.env` file. MongoDB variables are especially important as they are used by the project to connect to your MongoDB instance.
3. Run the project: `npm run start`.

### Production environment
The project deployment setup is handled by GitHub Actions. For default setup you can check [deploy.yml](.github/workflows/deploy.yml). You will also need a Linux or Windows system with SSH access, since FreeBSD isn't supported by Playwright.

To work automatically, you will need to set up a CRON job in your production environment to run the project with the sample rate you want.

#### Linux

Use `crontab -e` to open your crontab. For example, add the following line to run the project every 15 minutes:

```bash
*/15 * * * * xvfb-run npm run start --prefix=<path-to-app>
```

