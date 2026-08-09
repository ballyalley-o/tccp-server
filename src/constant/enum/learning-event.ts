export const LEARNING_EVENT =  [
        'lesson_started',
        'lesson_completed',
        'quiz_passed',
        'assignment_submitted',
        'resource_viewed',
        'discussion_posted',
        'login',
        'badge_earned'
] as const
export type LearningEventType       = (typeof LEARNING_EVENT)[number]

export const LEARNING_EVENT_SOURCE         = ['web', 'mobile', 'api'] as const
export type LearningEventSourceType        = (typeof LEARNING_EVENT_SOURCE)[number]
export const DEFAULT_LEARNING_EVENT_SOURCE = 'web'