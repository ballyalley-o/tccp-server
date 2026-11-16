import { translate } from 'google-translate-api-x'

const placeholders = (value: string) => Array.from(new Set(value.match(/\{[A-Za-z0-9_]+\}/g) || []))

async function translateText(input: string, lang: string): Promise<string> {
  const params = placeholders(input)
  let safeText = input

  params.forEach((param, index) => {
    safeText = safeText.replace(new RegExp(param, 'g'), `__LOCALE_PARAM_${index}__`)
  })

  const res = await translate(safeText, { to: lang })
  let text = (res as { text: string }).text

  params.forEach((param, index) => {
    text = text.replace(new RegExp(`__LOCALE_PARAM_${index}__`, 'g'), param)
  })

  return text
}

export { translateText }