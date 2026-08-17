import { MODULE } from "@config/module.config"

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

type ResourceName<T, Prefix extends string = ''> = T extends { name: infer N extends string }
    ? N | (Prefix extends '' ? T extends { submodule: infer S }
            ? S extends Record<string, unknown>
              ? ResourceName<S[keyof S], N>
              : never
            : never
          : T extends { submodule: infer S }
            ? S extends Record<string, unknown>
              ? `${Prefix}-${N}` |
                ResourceName<S[keyof S], `${Prefix}-${N}`>
              : `${Prefix}-${N}`
            : `${Prefix}-${N}`
    )
    : never

    type ResourceType = ResourceName<typeof MODULE[keyof typeof MODULE]>
}

export {}