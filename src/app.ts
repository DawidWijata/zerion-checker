import { ZerionApiClient } from './crawler.ts';
import { Logger } from './logger.ts';
import * as Utils from './utils.ts';

const api = new ZerionApiClient(process.env.ZERION_CHECK_LINK!, Logger);
const [duration, result] = await Utils.measureTimeAsync(() => api.checkAvailability());

Logger.info({ ...result, duration });
