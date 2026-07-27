import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { use, LogRequest } from '@decorator'
import { GLOBAL } from '@config'
import { cache } from '@util/cache'
import { Bootcamp, Course, Enrollment, Feedback, User } from '@model'
import { Code, Key, LOCALE } from '@constant/enum'
import { RESPONSE } from '@constant'

// type DashboardAudience = 'guest' | 'user' | 'trainer' | 'admin'

// type DashboardCountSummary = {
//   users    : number
//   trainers : number
//   admins   : number
//   bootcamps: number
//   courses  : number
//   feedback : number
// }

// type DashboardRecommendation = {
//   id    : string
//   title : string
//   meta  : string
//   action: string
//   path  : string
// }

// type DashboardCard = {
//   id      : string
//   label   : string
//   value   : string | number
//   tone    : 'primary' | 'success' | 'info' | 'warning' | 'error'
//   subtitle: string
// }

// type DashboardAction = {
//   id     : string
//   icon   : string
//   label  : string
//   path   : string
//   variant: 'contained' | 'outlined' | 'text'
// }

// type DashboardCourse = {
//   id      : string
//   title   : string
//   meta    : string
//   status  : string
//   progress: number
//   tone    : 'primary' | 'success' | 'info' | 'warning' | 'error'
//   subtitle: string
// }

class DashboardController {
  private static async getAuthenticatedUser(req: Request) {
    const request = req as any
    const token   = request.cookies?.token ?? (typeof request.headers?.authorization === 'string' && request.headers.authorization.startsWith(Key.Bearer)
      ? request.headers.authorization.split(' ')[1]
      : undefined)

    if (!token) {
      return null
    }

    try {
      const decoded = jwt.verify(token, GLOBAL.JWT_SECRET as string) as any
      if (!decoded?.id) {
        return null
      }

      const cacheKey = `user:${decoded.id}`
      let user = cache.get(cacheKey)

      if (!user) {
        user = await User.findById(decoded.id).select(Key.PasswordSelect).lean()
        if (user) {
          cache.set(cacheKey, user, 5 * 60 * 1000)
        }
      }

      return user
    } catch {
      return null
    }
  }

  private static getAudience(req: Request, authUser: any): DashboardAudienceType {
    const roleQuery = String(req.query.role ?? '').toLowerCase()

    if (roleQuery === 'guest' || roleQuery === 'user' || roleQuery === 'trainer' || roleQuery === 'admin') {
      return roleQuery as DashboardAudienceType
    }

    if (authUser?.role === 'user' || authUser?.role === 'trainer' || authUser?.role === 'admin') {
      return authUser.role
    }

    return 'guest'
  }

  private static getLocale(req: Request): string {
    const localeQuery = String(req.query.locale ?? req.query.lang ?? LOCALE.EN).toLowerCase()

    return Object.values(LOCALE).includes(localeQuery as LOCALE) ? localeQuery : LOCALE.EN
  }

  private static buildTopBootcampRecommendations(bootcamps: any[]): DashboardRecommendationType[] {
    return bootcamps.map((bootcamp, index) => ({
      id    : bootcamp._id?.toString() ?? `bootcamp-${index}`,
      title : bootcamp.name ?? `dashboard.bootcamp_${index + 1}`,
      meta  : 'dashboard.similar_bootcamps_in_market',
      action: 'dashboard.explore',
      path  : '/bootcamp'
    }))
  }

  private static buildFeaturedBootcamps(bootcamps: any[]) {
    return bootcamps.map((bootcamp, index) => ({
      id         : bootcamp._id?.toString() ?? `featured-${index}`,
      title      : bootcamp.name ?? `dashboard.bootcamp_${index + 1}`,
      meta       : 'dashboard.featured_description',
      rating     : bootcamp.rating ?? 0,
      averageCost: bootcamp.averageCost ?? 0,
      path       : '/bootcamp'
    }))
  }

  private static buildGuestDashboard(counts: DashboardCountSummaryType, recommendations: DashboardRecommendationType[], featured: any[]) {
    return {
      audience            : 'guest',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage      : 'dashboard.welcome_message_user',
      currentCourseTitle  : 'dashboard.your_current_courses',
      featuredTitle       : 'dashboard.featured_bootcamps',
      featuredDescription : 'dashboard.featured_description',
      recommendationTitle : 'dashboard.recommendation_title',
      stat                : [
        { id: 'users', label: 'dashboard.total_users', value: counts.users, tone: 'primary', subtitle: 'dashboard.all_users' },
        { id: 'bootcamps', label: 'dashboard.total_bootcamps', value: counts.bootcamps, tone: 'success', subtitle: 'dashboard.bootcamp_count' },
        { id: 'courses', label: 'dashboard.total_courses', value: counts.courses, tone: 'info', subtitle: 'dashboard.course_count' },
        { id: 'feedback', label: 'dashboard.total_feedback', value: counts.feedback, tone: 'warning', subtitle: 'dashboard.feedback_count' }
      ] as DashboardCardType[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'browse-bootcamps', icon: 'School', label: 'dashboard.browse_bootcamps', path: '/bootcamp', variant: 'contained' },
        { id: 'browse-courses', icon: 'Bookmark', label: 'dashboard.browse_courses', path: '/course', variant: 'outlined' },
        { id: 'profile', icon: 'Person', label: 'dashboard.view_profile', path: '/auth/account', variant: 'outlined' }
      ] as DashboardAction[],
      activity: [
        { label: 'days.mon', value: 35 },
        { label: 'days.wed', value: 42 },
        { label: 'days.thu', value: 58 },
        { label: 'days.fri', value: 70 },
        { label: 'days.sat', value: 54 },
        { label: 'days.sun', value: 76 }
      ],
      distribution: [
        { label: 'dashboard.skill_react', value: 42 },
        { label: 'dashboard.skill_api', value: 28 },
        { label: 'dashboard.skill_cloud', value: 18 },
        { label: 'dashboard.career', value: 12 }
      ]
    }
  }

  private static buildUserDashboard(counts: DashboardCountSummaryType, recommendations: DashboardRecommendationType[], featured: any[], enrollments: any[]) {
    const completedCourses = enrollments.filter((enrollment) => enrollment.status === 'completed').length
    const activeCourses = enrollments.filter((enrollment) => enrollment.status === 'in_progress').length
    const progressValue = enrollments.length ? Math.round(enrollments.reduce((sum, enrollment) => sum + Number(enrollment.progress || 0), 0) / enrollments.length) : 0

    const courseItems = enrollments.slice(0, 2).map((enrollment) => ({
      id      : enrollment._id?.toString() ?? String(enrollment.course?._id ?? enrollment.course ?? ''),
      title   : enrollment.course?.title ?? 'dashboard.course_title',
      meta    : enrollment.course?.description ?? 'dashboard.course_meta',
      status  : enrollment.status,
      progress: Number(enrollment.progress ?? 0),
      tone    : 'success' as const,
      subtitle: 'dashboard.keep_it_up'
    }))

    return {
      audience            : 'user',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage      : 'dashboard.welcome_message_user',
      currentCourseTitle  : 'dashboard.your_current_courses',
      featuredTitle       : 'dashboard.featured_bootcamps',
      featuredDescription : 'dashboard.featured_description',
      recommendationTitle : 'dashboard.recommendation_title',
      stat                : [
        { id: 'completed', label: 'dashboard.courses_completed', value: completedCourses, tone: 'success', subtitle: 'dashboard.keep_it_up' },
        { id: 'streak', label: 'dashboard.study_streak', value: activeCourses ? activeCourses + 1 : 1, tone: 'warning', subtitle: 'dashboard.days_row' },
        { id: 'pace', label: 'dashboard.average_speed', value: `${progressValue}%`, tone: 'info', subtitle: 'dashboard.of_target_pace' }
      ] as DashboardCardType[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'browse-bootcamps', icon: 'School', label: 'dashboard.browse_bootcamps', path: '/bootcamp', variant: 'contained' },
        { id: 'browse-courses', icon: 'Bookmark', label: 'dashboard.browse_courses', path: '/course', variant: 'outlined' },
        { id: 'profile', icon: 'Person', label: 'dashboard.view_profile', path: '/auth/account', variant: 'outlined' }
      ] as DashboardAction[],
      activity: [
        { label: 'days.mon', value: 35 },
        { label: 'days.wed', value: 42 },
        { label: 'days.thu', value: 58 },
        { label: 'days.fri', value: 70 },
        { label: 'days.sat', value: 54 },
        { label: 'days.sun', value: 76 }
      ],
      distribution: [
        { label: 'dashboard.skill_react', value: 42 },
        { label: 'dashboard.skill_api', value: 28 },
        { label: 'dashboard.skill_cloud', value: 18 },
        { label: 'dashboard.career', value: 12 }
      ],
      course: courseItems as DashboardCourse[]
    }
  }

  private static buildTrainerDashboard(counts: DashboardCountSummaryType, recommendations: DashboardRecommendationType[], featured: any[], trainerBootcamps: any[], studentCount: number) {
    const averageRating = trainerBootcamps.length
      ? Math.round(trainerBootcamps.reduce((sum, bootcamp) => sum + Number(bootcamp.rating || 0), 0) / trainerBootcamps.length)
      : 0

    return {
      audience            : 'trainer',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage      : 'dashboard.welcome_message_user',
      currentCourseTitle  : 'dashboard.your_current_courses',
      featuredTitle       : 'dashboard.featured_bootcamps',
      featuredDescription : 'dashboard.featured_description',
      recommendationTitle : 'dashboard.recommendation_title',
      stat                : [
        { id: 'active-courses', label: 'dashboard.active_courses', value: trainerBootcamps.length || 0, tone: 'primary', subtitle: 'dashboard.published_now' },
        { id: 'students', label: 'dashboard.total_students', value: studentCount, tone: 'success', subtitle: 'dashboard.across_all_courses' },
        { id: 'rating', label: 'dashboard.average_rating', value: `${averageRating}%`, tone: 'warning', subtitle: 'dashboard.out_of_max_rate' },
        { id: 'completion', label: 'dashboard.completion_rate', value: '87%', tone: 'info', subtitle: 'dashboard.last_cohort' }
      ] as DashboardCardType[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'create-course', icon: 'BookmarkAddSharp', label: 'dashboard.create_course', path: '/dashboard/manage', variant: 'contained' },
        { id: 'students', icon: 'Person', label: 'dashboard.view_students', path: '/dashboard/manage', variant: 'outlined' },
        { id: 'analytics', icon: 'InsightsSharp', label: 'dashboard.analytics', path: '/dashboard/manage', variant: 'outlined' }
      ] as DashboardAction[],
      activity: [
        { label: 'days.mon', value: 68 },
        { label: 'days.tue', value: 74 },
        { label: 'days.wed', value: 71 },
        { label: 'days.thu', value: 83 },
        { label: 'days.fri', value: 87 },
        { label: 'days.sat', value: 76 },
        { label: 'days.sun', value: 81 }
      ],
      distribution: [
        { label: 'dashboard.active', value: 57 },
        { label: 'dashboard.at_risk', value: 14 },
        { label: 'dashboard.review', value: 18 },
        { label: 'dashboard.done', value: 11 }
      ]
    }
  }

  private static buildAdminDashboard(counts: DashboardCountSummaryType, recommendations: DashboardRecommendationType[], featured: any[]) {
    return {
      audience            : 'admin',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage      : 'dashboard.welcome_message_user',
      currentCourseTitle  : 'dashboard.your_current_courses',
      featuredTitle       : 'dashboard.featured_bootcamps',
      featuredDescription : 'dashboard.featured_description',
      recommendationTitle : 'dashboard.recommendation_title',
      stat                : [
        { id: 'active-courses', label: 'dashboard.active_courses', value: counts.courses, tone: 'primary', subtitle: 'dashboard.published_now' },
        { id: 'students', label: 'dashboard.total_students', value: counts.users, tone: 'success', subtitle: 'dashboard.across_all_courses' },
        { id: 'rating', label: 'dashboard.average_rating', value: '4.8', tone: 'warning', subtitle: 'dashboard.out_of_max_rate' },
        { id: 'completion', label: 'dashboard.completion_rate', value: '87%', tone: 'info', subtitle: 'dashboard.last_cohort' }
      ] as DashboardCardType[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'manage', icon: 'ManageSearch', label: 'dashboard.manage_platform', path: '/dashboard/manage', variant: 'contained' },
        { id: 'bootcamps', icon: 'School', label: 'dashboard.browse_bootcamps', path: '/bootcamp', variant: 'outlined' },
        { id: 'account', icon: 'Person', label: 'dashboard.account', path: '/auth/account', variant: 'outlined' }
      ] as DashboardAction[],
      activity: [
        { label: 'days.mon', value: 72 },
        { label: 'days.tue', value: 78 },
        { label: 'days.wed', value: 74 },
        { label: 'days.thu', value: 82 },
        { label: 'days.fri', value: 88 },
        { label: 'days.sat', value: 69 },
        { label: 'days.sun', value: 75 }
      ],
      distribution: [
        { label: 'dashboard.role_student', value: counts.users },
        { label: 'dashboard.role_trainer', value: counts.trainers },
        { label: 'dashboard.role_admin', value: counts.admins }
      ]
    }
  }

  //@desc     Get dashboard data
  //@route    GET /dashboard
  //@access   PUBLIC
  @use(LogRequest)
  public static async getDashboard(req: Request, res: Response) {
    try {
      const [userCount, trainerCount, adminCount, bootcampCount, courseCount, feedbackCount] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: Key.Trainer }),
        User.countDocuments({ role: Key.Admin }),
        Bootcamp.countDocuments(),
        Course.countDocuments(),
        Feedback.countDocuments()
      ])

      const [topBootcamps, authUser] = await Promise.all([
        Bootcamp.find({}).sort({ rating: -1 }).limit(3).lean(),
        DashboardController.getAuthenticatedUser(req)
      ])

      const counts: DashboardCountSummaryType = {
        users    : userCount,
        trainers : trainerCount,
        admins   : adminCount,
        bootcamps: bootcampCount,
        courses  : courseCount,
        feedback : feedbackCount
      }

      const locale          = DashboardController.getLocale(req)
      const audience        = DashboardController.getAudience(req, authUser)
      const recommendations = DashboardController.buildTopBootcampRecommendations(topBootcamps)
      const featured        = DashboardController.buildFeaturedBootcamps(topBootcamps)

      const dashboardData = await (async () => {
        if (audience === 'user' && authUser) {
          const enrollments = await Enrollment.find({ user: authUser._id }).populate({ path: 'course', select: 'title description' }).lean()
          return DashboardController.buildUserDashboard(counts, recommendations, featured, enrollments)
        }

        if (audience === 'trainer' && authUser) {
          const trainerBootcamps = await Bootcamp.find({ user: authUser._id }).lean()
          const studentIds = await Enrollment.distinct('user', { bootcamp: { $in: trainerBootcamps.map((bootcamp) => bootcamp._id) } })
          return DashboardController.buildTrainerDashboard(counts, recommendations, featured, trainerBootcamps, studentIds.length)
        }

        if (audience === 'admin') {
          return DashboardController.buildAdminDashboard(counts, recommendations, featured)
        }

        return DashboardController.buildGuestDashboard(counts, recommendations, featured)
      })()

      res.status(Code.OK).json({ success: true, locale, data: dashboardData })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_FIND,
        error
      })
    }
  }
}

export default DashboardController
