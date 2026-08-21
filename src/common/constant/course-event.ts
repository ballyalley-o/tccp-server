export const COURSE_EVENT =  [
        'lesson_started',
        'lesson_completed',
        'quiz_passed',
        'assignment_submitted',
        'resource_viewed',
        'discussion_posted',
        'login',
        'badge_earned'
] as const
export type CourseEventType       = (typeof COURSE_EVENT)[number]

export const COURSE_EVENT_SOURCE         = ['web', 'mobile', 'api'] as const
export type CourseEventSourceType        = (typeof COURSE_EVENT_SOURCE)[number]
export const DEFAULT_COURSE_EVENT_SOURCE = 'web'