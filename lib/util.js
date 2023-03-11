export function makeSerializable(obj) {
    return JSON.parse(JSON.stringify(obj))
}
