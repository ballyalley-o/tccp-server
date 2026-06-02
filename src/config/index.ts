import path from 'path'
export { default as App } from './server'
export { default as connectDb } from './db'
export { default as GLOBAL } from './global'

export const __dirname = path.resolve()
