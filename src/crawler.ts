import { firefox } from "playwright";
import type { Logger } from "pino";
import { randomDelay } from "./utils.ts";

export class ZerionApiClient {
    private link: string;
    private logger: Logger;

    constructor(link: string, logger: Logger) {
        this.link = link;
        this.logger = logger;
    }

    public async checkAvailability(): Promise<Record<string, unknown>> {
        const context = await this.getContext();
        const page = await context.newPage();

        try {
            await page.goto(this.link, {
                waitUntil: 'domcontentloaded',
            });

            await page.waitForTimeout(randomDelay(1000, 3000));

            const button = page.getByText('Oglądaj').nth(1);
            await button.click();

            await page.waitForTimeout(randomDelay(600, 1300));

            const isVideoAvailable = await page
                .locator('.innerPlimit', { hasText: 'Wykup premium, aby uzyskać dostęp!' })
                .count() === 0;

            return { isAvailable: isVideoAvailable };
        } catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                this.logger.warn({ isTimeout: true });
                return { isAvailable: null };
            }

            this.logger.error(error);
        } finally {
            await context.browser()?.close();
        }

        return { isAvailable: false };
    }

    private async getContext() {
        const browser = await firefox.launch({ headless: false });
        const context = await browser.newContext({
            viewport: {
                width: 1280 + Math.floor(Math.random() * 100),
                height: 720 + Math.floor(Math.random() * 100),
            },
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0",
            locale: "pl-PL",
            timezoneId: "Europe/Warsaw",
            permissions: ['geolocation'],
            javaScriptEnabled: true,
            acceptDownloads: true,
            bypassCSP: true,
            ignoreHTTPSErrors: true,
        });

        await context.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        });

        return context;
    }
}