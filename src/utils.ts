export function measureTime<T>(callback: (...args: any[]) => T): [number, T] {
    const start = process.hrtime();
    const result = callback();
    const end = process.hrtime(start);

    return [end[0] + Math.round(end[1] / 1e6) / 1e3, result];
}

export async function measureTimeAsync<T>(callback: (...args: any[]) => Promise<T>): Promise<[number, T]> {
    const start = process.hrtime();
    const result = await callback();
    const end = process.hrtime(start);

    return [end[0] + Math.round(end[1] / 1e6) / 1e3, result];
}

export function randomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
