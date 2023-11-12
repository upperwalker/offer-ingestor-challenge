export function objectEntries<T>(o: T extends object ? T : never) {
  return Object.entries(o) as [keyof T, T[keyof T]][];
}
