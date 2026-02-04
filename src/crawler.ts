import { firefox, type Page } from "playwright";
import type { Logger } from "pino";
import { random } from "./utils.ts";

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
            await this.cloudflareDelay(page);
            await page.goto(this.link, { waitUntil: 'domcontentloaded' });
            await this.cloudflareDelay(page);

            const button = page.getByText('Oglądaj').nth(1);

            await button.click();
            await page.waitForTimeout(random(2000, 4000));

            const isCloudflareTriggered = await page
                .locator('.player-captcha')
                .isVisible();

            const isAvailable = await page
                .locator('.player-plimit', { hasText: 'Wykup premium, aby uzyskać dostęp!' })
                .isHidden();

            return { isAvailable, isCloudflareTriggered };
        } catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                this.logger.warn({ isTimeout: true });
                return { isAvailable: null, isCloudflareTriggered: null };
            }

            this.logger.error(error);
        } finally {
            await context.browser()?.close();
        }

        return { isAvailable: false, isCloudflareTriggered: false };
    }

    private async getContext() {
        const isCloudflareBypassOn = process.env.CLOUDFLARE === 'true';

        if (!isCloudflareBypassOn) {
            return await firefox.launch({ headless: false }).then((browser) => browser.newContext());
        }

        // TODO: adjust the protection to be accepted by cloudflare
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

    private async cloudflareDelay(page: Page) {
        const isCloudflareBypassOn = process.env.CLOUDFLARE === 'true';

        if (isCloudflareBypassOn) {
            await page.waitForTimeout(random(1000, 3000));
        }
    }
}