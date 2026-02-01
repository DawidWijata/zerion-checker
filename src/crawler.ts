import { chromium } from "playwright";
import type { Logger } from "pino";

export class ZerionApiClient {
    private link: string = '';
    private logger: Logger;

    constructor(link: string, logger: Logger) {
        this.link = link;
        this.logger = logger;
    }

    public async checkAvailability(): Promise<boolean> {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        try {
            await page.goto(this.link);

            const button = page.getByText('Oglądaj').nth(1);
            await button.click();

            const isIframeLoaded = await page.getByText('Serwery zajęte!!!').count() === 0;
            await browser.close();

            return isIframeLoaded;
        } catch (error) {
            this.logger.error(error);
        }

        return false;
    }
}