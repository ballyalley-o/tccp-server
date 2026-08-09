export const ENROLLMENT_STATUS                               = ['enrolled', 'in_progress', 'completed', 'dropped'] as const
export type EnrollmentStatusType                             = (typeof ENROLLMENT_STATUS)[number]
export const DEFAULT_ENROLLMENT_STATUS: EnrollmentStatusType = 'enrolled'