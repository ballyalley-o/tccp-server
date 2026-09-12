import GLOBAL             from '@config/global.config'
import { en, es, fr, ja } from './message'

export const locales = { en, es, fr, ja } as const

export type LocaleLang = keyof typeof locales
export type AppLocale  = typeof en

export type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${NestedKeys<T[K]>}`
      : never
}[keyof T & string]

export type LocaleKey    = NestedKeys<AppLocale>
export type LocaleParams = Record<string, string | number | boolean>

export const DEFAULT_LOCALE: LocaleLang = isSupportedLocale(GLOBAL.LOCALE) ? GLOBAL.LOCALE : 'en'

export function isSupportedLocale(locale: unknown): locale is LocaleLang {
  return typeof locale === 'string' && locale in locales
}
