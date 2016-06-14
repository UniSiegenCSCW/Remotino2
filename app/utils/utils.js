export function timestamp() {
  return new Date() / 1.0;
}


export function getNested(obj, keys) {
  if (obj === undefined) return undefined;
  if (keys.length === 0) return obj;

  const head = keys[0];
  const tail = keys.slice(1);

  return getNested(obj[head], tail);
}
