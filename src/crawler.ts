import { chromium } from "playwright";
import type { Logger } from "pino";

export class ZerionApiClient {
    private link: string = '';
    private logger: Logger;

    constructor(link: string, logger: Logger) {
        this.link = link;
        this.logger = logger;
    }

    public async checkAvailability(): Promise<Record<string, unknown>> {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        try {
            await page.goto(this.link);

            const button = page.getByText('Oglądaj').nth(1);
            await button.click();

            await page.waitForSelector('.player-plimit');

            const isVideoVisible = await page.locator('.player-plimit').isHidden();

            return { isAvailable: isVideoVisible };
        } catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                this.logger.warn({ isTimeout: true });
                return { isAvailable: null };
            }

            this.logger.error(error);
        } finally {
            await browser.close();
        }

        return { isAvailable: false };
    }
}