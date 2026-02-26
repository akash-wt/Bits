export function shortenKey(key: string) {
    return key.slice(0, 7) + "..." + key.slice(-7);
}