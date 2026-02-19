import { RefType } from '../generated'

export function getImageUrl(basePath: string, objectId: string | number): string {
  return `${basePath}/images/${objectId}/${RefType.Logo}`
}
