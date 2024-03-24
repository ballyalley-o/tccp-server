import path from 'path'
export { default as App } from '@config/server'
export { default as connectDb } from '@config/db'
export { default as GLOBAL } from '@config/global'

export const __dirname = path.resolve()
