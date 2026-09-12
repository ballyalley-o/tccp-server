import type {
  AppLocale as I18nAppLocale,
  LocaleKey as I18nLocaleKey,
  LocaleLang as I18nLocaleLang,
  LocaleParams as I18nLocaleParams,
  NestedKeys as I18nNestedKeys
} from './locale.config'

declare global {
    type LocaleLang    = I18nLocaleLang

    type AppLocale     = I18nAppLocale

    type NestedKeys<T> = I18nNestedKeys<T>

    type LocaleKey    = I18nLocaleKey

    type LocaleParams = I18nLocaleParams
}

export {}
