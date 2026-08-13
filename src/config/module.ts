import { ACTION } from "./permission"

export const MODULE = {
    Auth: {
        name     : 'auth',
        labelKey : 'auth',
        path     : 'auth',
        action   : ACTION,
        submodule: {
            User: {
                name    : 'user',
                labelKey: 'user',
                path    : 'user',
                action  : ACTION,
            },
            Role: {
                name    : 'role',
                labelKey: 'role',
                path    : 'role',
                action  : ACTION,
            },
        }
    },
    Bootcamp: {
        name    : 'bootcamp',
        labelKey: 'bootcamp',
        path    : 'bootcamp',
        action  : ACTION
    },
    Course: {
        name     : 'course',
        labelKey : 'course',
        path     : 'course',
        action   : ACTION,
        submodule: {
            CourseLecture: {
                name    : 'lecture',
                labelKey: 'course_lecture',
                path    : 'lecture',
                action  : ACTION
            },
            CourseModule: {
                name    : 'module',
                labelKey: 'course_module',
                path    : 'module',
                action  : ACTION,
            },
            CourseQuiz: {
                name    : 'quiz',
                labelKey: 'course_quiz',
                path    : 'quiz',
                action  : ACTION
            },
        }
    },
    Feedback: {
        name    : 'feedback',
        labelKey: 'feedback',
        path    : 'feedback',
        action  : ACTION
    },
    Skill: {
        name     : 'skill',
        labelKey : 'skill',
        path     : 'skill',
        action   : ACTION,
        submodule: {
            SkillCategory: {
                name    : 'category',
                labelKey: 'skill_category',
                path    : 'category',
                action  : ACTION

            }
        }
    },
    Dashboard: {
        name    : 'dashboard',
        labelKey: 'dashboard',
        path    : 'dashboard',
        action  : ACTION,
    },
    Setting: {
        name    : 'setting',
        labelKey: 'setting',
        path    : 'setting',
        action  : ACTION
    },
    LearningEvent: {
        name    : 'learning-event',
        labelKey: 'learning_event',
        path    : 'learning-event',
        action  :ACTION
    },
    Audit: {
        name    : 'audit',
        labelKey: 'audit',
        path    : 'audit',
        action  :ACTION,
        submodule: {
            AuditLog: {
                name    : 'log',
                labelKey: 'audit_log',
                path    : 'log',
                action  : ACTION
            }
        }
    }

} as const satisfies Record<string, ModuleType>