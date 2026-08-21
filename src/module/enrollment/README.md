# Enrollment Module Structure Guideline

This module should be organized like a scalable modular monolith: each business capability owns its routes, controllers, services, models, validation, and module-local types. Shared framework code stays in `src/common`.

The goal is simple: a developer should open one module folder and understand the full feature without hunting across the whole app.

## Naming Standard

Use lowercase kebab-case for filenames. Add a clear suffix that describes the file responsibility.

```txt
enrollment.controller.ts
enrollment.route.ts
enrollment.service.ts
enrollment.model.ts
enrollment.schema.ts
enrollment.type.ts
enrollment.constant.ts
enrollment.permission.ts
```

For sub-features, keep the entity name first.

```txt
enrollment.blah.controller.ts
```

Avoid vague filenames like:

```txt
helper.ts
utils.ts
data.ts
main.ts
logic.ts
```

If a helper is truly shared by many modules, move it to `src/common/util`. If it is only used by `enrollment`, name it after the behavior.

```txt
build-enrollment-filter.ts
normalize-enrollment-order.ts
assert-enrollment-category-exists.ts
```

## Recommended Folder Shape

Use this structure as the target shape for this module:

```txt
src/module/enrollment/
  README.md
  index.ts
  enrollment.module.ts

  enrollment/
    enrollment.controller.ts
    enrollment.route.ts
    enrollment.service.ts
    enrollment.model.ts
    enrollment.schema.ts
    enrollment.type.ts
    index.ts
```

If the model remains shared temporarily under `src/model`, keep the module route and controller imports stable through the module `index.ts`. Do not scatter model imports across unrelated folders.

## Responsibility Rules

Controllers should only handle HTTP concerns:

- read `req.params`, `req.query`, `req.body`, and authenticated user data
- call service functions
- send the response
- pass errors to `next`

Services should own business logic:

- create, update, delete, and query rules
- permission-aware decisions that are specific to enrollment behavior
- validation that requires database reads
- orchestration across `Skill` and `SkillCategory`

Routes should only wire Express:

- HTTP method
- path
- middleware
- controller handler

Models should only describe persistence:

- mongoose schema
- indexes
- virtuals
- hooks
- model export

Validation schemas should live beside the feature they protect:

```txt
enrollment.schema.ts
enrollment-category.schema.ts
```

## Import Rules

Prefer imports from the module public API.

```ts
import { SkillController } from '@module/enrollment'
```

Avoid deep imports from another module.

```ts
// Avoid this from outside the enrollment module.
import SkillController from '@module/enrollment/enrollment/controller/enrollment.controller'
```

Inside the enrollment module, local relative imports are acceptable when they stay close and readable.

```ts
import { createSkill } from './enrollment.service'
```

Shared app infrastructure should come from `src/common`.

```ts
import { advancedResult } from '@common/middleware'
import { protect, authorizeAction } from '@common/security/guard'
import { RESPONSE } from '@common/constant'
```

## Module Boundary Rules

Keep these inside `src/module/enrollment`:

- enrollment routes
- enrollment controllers
- enrollment services
- enrollment category routes
- enrollment category controllers
- enrollment category services
- enrollment-specific validation
- enrollment-specific permissions
- enrollment-specific query builders

Keep these outside the module:

- Express app bootstrapping
- database connection
- global error handler
- generic async handler
- generic auth guard primitives
- generic constants
- reusable response helpers
- global type declarations

If code is used by only one module, it belongs in that module. If code is used by three or more modules, consider moving it to `src/common`.

## Public API

Every module should export through `index.ts`.

```ts
export { default as skillRoute } from './enrollment/enrollment.route'
export { default as skillCategoryRoute } from './category/enrollment-category.route'
export { default as SkillController } from './enrollment/enrollment.controller'
export { default as SkillCategoryController } from './category/enrollment-category.controller'
```

The rest of the app should depend on this public API, not private internal paths.

## Route Registration

Prefer one module registration file.

```ts
import type { Application } from 'express'
import { PathDir } from '@route/dir'
import { skillRoute, skillCategoryRoute } from './index'

export const registerSkillModule = (app: Application) => {
  app.use(PathDir.SKILL_CATEGORY, skillCategoryRoute)
  app.use(PathDir.SKILL, skillRoute)
}
```

This keeps the app bootstrap clean and makes modules easy to add or remove.

## Endpoint Checklist

When adding a new enrollment endpoint:

1. Add or update the validation schema.
2. Add service logic for the business rule.
3. Add the controller method.
4. Register the route with the correct guard and permission.
5. Export through `index.ts` only if other modules need it.
6. Add or update tests.
7. Run the targeted test or build command.

## Migration Rule

Move one feature at a time. Do not restructure every module in a single change.

Recommended order:

1. Skill
2. Feedback
3. Bootcamp
4. Enrollment
5. Course
6. Auth

Auth should be moved last because it touches tokens, cookies, roles, permissions, cache, and route protection.

## Quality Bar

Before merging a module restructure, check these:

- route paths did not change unless intended
- permissions did not become weaker
- imports do not point to old folders
- no circular imports were introduced
- build passes
- related model tests pass
- public API exports are clear

This is the standard used in large codebases: strong module boundaries, boring file names, explicit public exports, and small migrations that keep production behavior stable.
