import { ACTION } from "./permission.config"

export const MODULE  = {
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
            Account: {
                name    : 'account',
                labelKey: 'account',
                action  : ACTION
            },
            Register: {
                name    : 'register',
                labelKey: 'register',
                action  : ACTION
            },
            LogIn: {
                name    : 'log-in',
                labelKey: 'log_in',
                action  : ACTION
            },
            LogOut: {
                name    : 'log-out',
                labelKey: 'log_out',
                action  : ACTION
            }
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
    Enrollment: {
        name    : 'enrollment',
        labelKey: 'enrollment',
        action  : ACTION
    },
    LearningEvent: {
        name    : 'learning-event',
        labelKey: 'learning_event',
        action  :ACTION
    },
    Setting: {
        name    : 'setting',
        labelKey: 'setting',
        action  : ACTION
    },
    System: {
        name     : 'system',
        labelKey : 'system',
        action   : ACTION,
        submodule: {
            SystemInfo: {
                name    : 'info',
                labelKey: 'system_info',
                action  : ACTION
            },
            SystemHealth: {
                name    : 'health',
                labelKey: 'system_health',
                action  : ACTION
            }
        }
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


export const _getKey    = <T extends object, K extends keyof T>(_obj: T, key: K): K => key
export const MODULE_KEY = {
    AUTH          : _getKey(MODULE, 'Auth'),
    ROLE          : _getKey(MODULE.Auth.submodule, 'Role'),
    USER          : _getKey(MODULE.Auth.submodule, 'User'),
    BOOTCAMP      : _getKey(MODULE, 'Bootcamp'),
    COURSE        : _getKey(MODULE, 'Course'),
    COURSE_LECTURE: _getKey(MODULE.Course.submodule, 'CourseLecture'),
    COURSE_MODULE : _getKey(MODULE.Course.submodule, 'CourseModule'),
    COURSE_QUIZ   : _getKey(MODULE.Course.submodule, 'CourseQuiz'),
    ENROLLMENT    : _getKey(MODULE, 'Enrollment'),
    FEEDBACK      : _getKey(MODULE, 'Feedback'),
    SKILL         : _getKey(MODULE, 'Skill'),
    SKILL_CATEGORY: _getKey(MODULE.Skill.submodule, 'SkillCategory'),
    DASHBOARD     : _getKey(MODULE, 'Dashboard'),
    SETTING       : _getKey(MODULE, 'Setting'),
    LEARNING_EVENT: _getKey(MODULE, 'LearningEvent'),
    AUDIT         : _getKey(MODULE, 'Audit'),
    AUDIT_LOG     : _getKey(MODULE.Audit.submodule, 'AuditLog'),
} as const