import { ZerionApiClient } from './crawler.ts';
import { Logger } from './logger.ts';
import * as Utils from './utils.ts';

const MINUTE = 60_000;

const api = new ZerionApiClient(process.env.ZERION_CHECK_LINK!, Logger);
const delay = Utils.randomDelay(1 * MINUTE, 5 * MINUTE);

Logger.trace(`Waiting for ${delay}ms`);
await new Promise(resolve => setTimeout(resolve, delay));

const [duration, result] = await Utils.measureTimeAsync(() => api.checkAvailability());

Logger.info({ ...result, duration });
