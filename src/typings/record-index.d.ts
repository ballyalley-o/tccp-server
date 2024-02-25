import { IndexDirection } from 'mongoose'

export type IndexType<T extends Record<string, number>> = {
  [K in keyof T]: IndexDirection
}
