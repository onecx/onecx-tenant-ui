export function isValidDate(value: any): value is Date {
  return value instanceof Date && !Number.isNaN(value as any)
}
