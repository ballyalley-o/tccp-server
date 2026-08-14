import { ACTION } from "./permission"

export const MODULE    = {
    Auth: {
        name     : 'auth',
        labelKey : 'auth',
        action   : ACTION,
        submodule: {
            User: {
                name    : 'user',
                labelKey: 'user',
                action  : ACTION,
            },
            Role: {
                name    : 'role',
                labelKey: 'role',
                action  : ACTION,
            },
        }
    },
    Bootcamp: {
        name    : 'bootcamp',
        labelKey: 'bootcamp',
        action  : ACTION
    },
    Course: {
        name     : 'course',
        labelKey : 'course',
        action   : ACTION,
        submodule: {
            CourseLecture: {
                name    : 'lecture',
                labelKey: 'course_lecture',
                action  : ACTION
            },
            CourseModule: {
                name    : 'module',
                labelKey: 'course_module',
                action  : ACTION,
            },
            CourseQuiz: {
                name    : 'quiz',
                labelKey: 'course_quiz',
                action  : ACTION
            },
        }
    },
    Feedback: {
        name    : 'feedback',
        labelKey: 'feedback',
        action  : ACTION
    },
    Skill: {
        name     : 'skill',
        labelKey : 'skill',
        action   : ACTION,
        submodule: {
            SkillCategory: {
                name    : 'category',
                labelKey: 'skill_category',
                action  : ACTION

            }
        }
    },
    Dashboard: {
        name    : 'dashboard',
        labelKey: 'dashboard',
        action  : ACTION,
    },
    Setting: {
        name    : 'setting',
        labelKey: 'setting',
        action  : ACTION
    },
    LearningEvent: {
        name    : 'learning-event',
        labelKey: 'learning_event',
        action  :ACTION
    },
    Audit: {
        name    : 'audit',
        labelKey: 'audit',
        action  :ACTION,
        submodule: {
            AuditLog: {
                name    : 'log',
                labelKey: 'audit_log',
                action  : ACTION
            }
        }
    }

} as const satisfies Record<string, Module.ConfigType>