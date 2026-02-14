export function stringToUint8Array(msg: string): Uint8Array {
    const buffer = Buffer.from(msg, 'base64');
    const uint8array = new Uint8Array(buffer);
    return uint8array;
}
