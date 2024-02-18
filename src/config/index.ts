import path from 'path'
export { default as App } from '@config/app-config'
export { default as setHeader } from '@config/header'
export { default as connectDb } from '@config/db'
export { default as GLOBAL } from '@config/global'

export const __dirname = path.resolve()
