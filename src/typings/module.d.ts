import { MODULE } from "@config/module"

declare global {
    type ModuleType = {
        name      : string
        labelKey  : string                     // TODO: impl LocaleKey
        path      : string
        action    : readonly ActionType[]
        submodule?: Record<string, ModuleType>
    }

    type SubmoduleType<M extends keyof typeof MODULE> =
        typeof MODULE[M]['submodule'] extends infer S
            ? S extends Record<string, unknown>
                ? keyof S
                : never
            : never

    type ResourceName<T> = T extends { name: infer N extends string }
      ? N | (T extends { submodule: infer S } ? (S extends Record<string, unknown> ? ResourceName<S[keyof S]> : never) : never)
      : never

    type ResourceType = ResourceName<typeof MODULE[keyof typeof MODULE]>
}

export {}