export function groupBy<T, K extends string | number, V>(
  items: T[],
  keyFn: (item: T) => K,
  init: () => V,
  reducer: (acc: V, item: T) => void,
): Map<K, V> {
  const map = new Map<K, V>();
  for (const item of items) {
    const key = keyFn(item);
    let acc = map.get(key);
    if (!acc) {
      acc = init();
      map.set(key, acc);
    }
    reducer(acc, item);
  }
  return map;
}
