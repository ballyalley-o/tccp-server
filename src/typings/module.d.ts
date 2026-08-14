import { MODULE } from "@config/module"

declare global {
    namespace Module {
    type Key = keyof typeof MODULE

    type ConfigType = {
        name      : string
        labelKey  : string                      // TODO: impl LocaleKey
        action    : readonly ActionType[]
        submodule?: Record<string, ConfigType>
    }

    type SubmoduleKey<M extends Key> = (typeof MODULE)[M]['submodule'] extends infer S
        ? S extends Record<string, unknown>
          ? keyof S
          : never
        : never
    }


    type ResourceName<T> = T extends { name: infer N extends string }
      ? N | (T extends { submodule: infer S } ? (S extends Record<string, unknown> ? ResourceName<S[keyof S]> : never) : never)
      : never

    type ResourceType = ResourceName<typeof MODULE[keyof typeof MODULE]>
}

export {}