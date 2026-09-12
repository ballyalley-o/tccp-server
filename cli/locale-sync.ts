/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs                from 'fs'
import { fileURLToPath } from 'url'
import path              from 'path'
import { translateText } from '@tccp/i18n'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const { en }     = await import(path.resolve(__dirname, '../src/lib/locale/en.ts'))
const localesDir = path.resolve(__dirname, '../src/lib/locale')
const base       = en

const targets = ['fr', 'es', 'ja'] as const

async function syncKeys(baseObj: any, targetObj: any, lang: string): Promise<any> {
  const result: any = { ...targetObj }

  for (const key in baseObj) {
    if (typeof baseObj[key] === 'object' && baseObj[key] !== null) {
      result[key] = await syncKeys(baseObj[key], result[key] || {}, lang)
    } else {
      if (!result[key]) {
        try {
          const text  = await translateText(baseObj[key], lang)
          result[key] = text
          console.log(`Translated [${lang}] ${key}: "${baseObj[key]}" → "${text}"`)
        } catch (err) {
          console.error(`⚠️ Failed translating "${baseObj[key]}" to ${lang}`)
          result[key] = '__MISSING__'
        }
      }
    }
  }
  return result
}

async function run() {
  for (const lang of targets) {
    const filePath = path.join(localesDir, `${lang}.ts`)

    let current: any = {}
    if (fs.existsSync(filePath)) {
      const raw   = fs.readFileSync(filePath, 'utf8')
      const match = raw.match(/export const \w+ = ([\s\S]*) as const/)
      if (match) {
        current = eval('(' + match[1] + ')')
      }
    }

    const updated = await syncKeys(base, current, lang)

    const content = `export const ${lang} = ${JSON.stringify(updated, null, 2)} as const\n`
    fs.writeFileSync(filePath, content, 'utf8')

    console.log(`✅ Updated ${lang}.ts`)
  }
}

run()
