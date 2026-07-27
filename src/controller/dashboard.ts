import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { use, LogRequest } from '@decorator'
import { GLOBAL } from '@config'
import { cache } from '@util/cache'
import { Bootcamp, Course, Enrollment, Feedback, LearningEvent, User } from '@model'
import { Code, Key, LOCALE } from '@constant/enum'
import { RESPONSE } from '@constant'

type DashboardAudience = 'guest' | 'user' | 'trainer' | 'admin'

type DashboardCountSummary = {
  users: number
  trainers: number
  admins: number
  bootcamps: number
  courses: number
  feedback: number
}

type DashboardRecommendation = {
  id: string
  title: string
  meta: string
  action: string
  path: string
}

type DashboardCard = {
  id: string
  label: string
  value: string | number
  tone: 'primary' | 'success' | 'info' | 'warning' | 'error'
  subtitle: string
}

type DashboardAction = {
  id: string
  icon: string
  label: string
  path: string
  variant: 'contained' | 'outlined' | 'text'
}

type DashboardCourse = {
  id: string
  title: string
  meta: string
  status: string
  progress: number
  tone: 'primary' | 'success' | 'info' | 'warning' | 'error'
  subtitle: string
}

class DashboardController {
  private static async getAuthenticatedUser(req: Request) {
    const request = req as any
    const token = request.cookies?.token ?? (typeof request.headers?.authorization === 'string' && request.headers.authorization.startsWith(Key.Bearer)
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

  private static getAudience(req: Request, authUser: any): DashboardAudience {
    const roleQuery = String(req.query.role ?? '').toLowerCase()

    if (roleQuery === 'guest' || roleQuery === 'user' || roleQuery === 'trainer' || roleQuery === 'admin') {
      return roleQuery as DashboardAudience
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

  private static buildTopBootcampRecommendations(bootcamps: any[]): DashboardRecommendation[] {
    return bootcamps.map((bootcamp, index) => ({
      id: bootcamp._id?.toString() ?? `bootcamp-${index}`,
      title: bootcamp.name ?? `dashboard.bootcamp_${index + 1}`,
      meta: 'dashboard.similar_bootcamps_in_market',
      action: 'dashboard.explore',
      path: '/bootcamp'
    }))
  }

  private static buildFeaturedBootcamps(bootcamps: any[]) {
    return bootcamps.map((bootcamp, index) => ({
      id: bootcamp._id?.toString() ?? `featured-${index}`,
      title: bootcamp.name ?? `dashboard.bootcamp_${index + 1}`,
      meta: 'dashboard.featured_description',
      rating: bootcamp.rating ?? 0,
      averageCost: bootcamp.averageCost ?? 0,
      path: '/bootcamp'
    }))
  }

  private static buildActivitySeries(events: any[], locale = 'en', periodDays = 7) {
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - periodDays + 1)

    const labels = Array.from({ length: periodDays }, (_value, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      return date.toISOString().slice(0, 10)
    })

    const valueMap = new Map<string, number>()

    events.forEach((event) => {
      const occurredAt = event.occurredAt ? new Date(event.occurredAt) : null
      if (!occurredAt) {
        return
      }

      const dateKey = occurredAt.toISOString().slice(0, 10)
      if (valueMap.has(dateKey)) {
        valueMap.set(dateKey, valueMap.get(dateKey)! + 1)
      } else {
        valueMap.set(dateKey, 1)
      }
    })

    const timeZoneFormatter = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })
    const series = labels.map((dateKey) => ({
      date: dateKey,
      label: timeZoneFormatter.format(new Date(dateKey)),
      value: valueMap.get(dateKey) ?? 0
    }))

    const previousWindowStart = new Date(startDate)
    previousWindowStart.setDate(previousWindowStart.getDate() - periodDays)
    const previousWindowEnd = new Date(startDate)
    previousWindowEnd.setDate(previousWindowEnd.getDate() - 1)

    const previousTotal = events.filter((event) => {
      const occurredAt = event.occurredAt ? new Date(event.occurredAt) : null
      return occurredAt && occurredAt >= previousWindowStart && occurredAt <= previousWindowEnd
    }).length

    const total = series.reduce((sum, item) => sum + item.value, 0)
    const trendValue = previousTotal === 0
      ? (total > 0 ? 100 : 0)
      : Math.round(((total - previousTotal) / previousTotal) * 100)
    const trend = `${trendValue >= 0 ? '+' : ''}${trendValue}%`

    return {
      period: `${periodDays}d`,
      series,
      total,
      trend
    }
  }

  private static buildSkillDistribution(courseItems: Array<{ course?: any; progress?: number }>) {
    const valueMap = new Map<string, number>()

    courseItems.forEach((item) => {
      const course = item.course
      const skills = Array.isArray(course?.skills) ? course.skills : []
      const weight = typeof item.progress === 'number' && item.progress > 0
        ? Math.max(1, Math.round((item.progress / 100) * 10))
        : 1

      skills.forEach((skill: any) => {
        const label = skill.labelKey || skill.id || 'skills.unknown'
        const nextValue = (valueMap.get(label) ?? 0) + weight
        valueMap.set(label, nextValue)
      })
    })

    return Array.from(valueMap.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }))
  }

  private static buildGuestDashboard(counts: DashboardCountSummary, recommendations: DashboardRecommendation[], featured: any[], activityData: any, skillDistribution: Array<{ label: string; value: number }>) {
    return {
      audience: 'guest',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage: 'dashboard.welcome_message_user',
      currentCourseTitle: 'dashboard.your_current_courses',
      featuredTitle: 'dashboard.featured_bootcamps',
      featuredDescription: 'dashboard.featured_description',
      recommendationTitle: 'dashboard.recommendation_title',
      stat: [
        { id: 'users', label: 'dashboard.total_users', value: counts.users, tone: 'primary', subtitle: 'dashboard.all_users' },
        { id: 'bootcamps', label: 'dashboard.total_bootcamps', value: counts.bootcamps, tone: 'success', subtitle: 'dashboard.bootcamp_count' },
        { id: 'courses', label: 'dashboard.total_courses', value: counts.courses, tone: 'info', subtitle: 'dashboard.course_count' },
        { id: 'feedback', label: 'dashboard.total_feedback', value: counts.feedback, tone: 'warning', subtitle: 'dashboard.feedback_count' }
      ] as DashboardCard[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'browse-bootcamps', icon: 'School', label: 'dashboard.browse_bootcamps', path: '/bootcamp', variant: 'contained' },
        { id: 'browse-courses', icon: 'Bookmark', label: 'dashboard.browse_courses', path: '/course', variant: 'outlined' },
        { id: 'profile', icon: 'Person', label: 'dashboard.view_profile', path: '/auth/account', variant: 'outlined' }
      ] as DashboardAction[],
      activity: activityData,
      skillDistribution,
      distribution: skillDistribution
    }
  }

  private static buildUserDashboard(counts: DashboardCountSummary, recommendations: DashboardRecommendation[], featured: any[], enrollments: any[], activityData: any, skillDistribution: Array<{ label: string; value: number }>) {
    const completedCourses = enrollments.filter((enrollment) => enrollment.status === 'completed').length
    const activeCourses = enrollments.filter((enrollment) => enrollment.status === 'in_progress').length
    const progressValue = enrollments.length ? Math.round(enrollments.reduce((sum, enrollment) => sum + Number(enrollment.progress || 0), 0) / enrollments.length) : 0

    const courseItems = enrollments.slice(0, 2).map((enrollment) => ({
      id: enrollment._id?.toString() ?? String(enrollment.course?._id ?? enrollment.course ?? ''),
      title: enrollment.course?.title ?? 'dashboard.course_title',
      meta: enrollment.course?.description ?? 'dashboard.course_meta',
      status: enrollment.status,
      progress: Number(enrollment.progress ?? 0),
      tone: 'success' as const,
      subtitle: 'dashboard.keep_it_up'
    }))

    return {
      audience: 'user',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage: 'dashboard.welcome_message_user',
      currentCourseTitle: 'dashboard.your_current_courses',
      featuredTitle: 'dashboard.featured_bootcamps',
      featuredDescription: 'dashboard.featured_description',
      recommendationTitle: 'dashboard.recommendation_title',
      stat: [
        { id: 'completed', label: 'dashboard.courses_completed', value: completedCourses, tone: 'success', subtitle: 'dashboard.keep_it_up' },
        { id: 'streak', label: 'dashboard.study_streak', value: activeCourses ? activeCourses + 1 : 1, tone: 'warning', subtitle: 'dashboard.days_row' },
        { id: 'pace', label: 'dashboard.average_speed', value: `${progressValue}%`, tone: 'info', subtitle: 'dashboard.of_target_pace' }
      ] as DashboardCard[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'browse-bootcamps', icon: 'School', label: 'dashboard.browse_bootcamps', path: '/bootcamp', variant: 'contained' },
        { id: 'browse-courses', icon: 'Bookmark', label: 'dashboard.browse_courses', path: '/course', variant: 'outlined' },
        { id: 'profile', icon: 'Person', label: 'dashboard.view_profile', path: '/auth/account', variant: 'outlined' }
      ] as DashboardAction[],
      activity: activityData,
      skillDistribution,
      distribution: skillDistribution,
      course: courseItems as DashboardCourse[]
    }
  }

  private static buildTrainerDashboard(counts: DashboardCountSummary, recommendations: DashboardRecommendation[], featured: any[], trainerBootcamps: any[], studentCount: number, activityData: any, skillDistribution: Array<{ label: string; value: number }>) {
    const averageRating = trainerBootcamps.length
      ? Math.round(trainerBootcamps.reduce((sum, bootcamp) => sum + Number(bootcamp.rating || 0), 0) / trainerBootcamps.length)
      : 0

    return {
      audience: 'trainer',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage: 'dashboard.welcome_message_user',
      currentCourseTitle: 'dashboard.your_current_courses',
      featuredTitle: 'dashboard.featured_bootcamps',
      featuredDescription: 'dashboard.featured_description',
      recommendationTitle: 'dashboard.recommendation_title',
      stat: [
        { id: 'active-courses', label: 'dashboard.active_courses', value: trainerBootcamps.length || 0, tone: 'primary', subtitle: 'dashboard.published_now' },
        { id: 'students', label: 'dashboard.total_students', value: studentCount, tone: 'success', subtitle: 'dashboard.across_all_courses' },
        { id: 'rating', label: 'dashboard.average_rating', value: `${averageRating}%`, tone: 'warning', subtitle: 'dashboard.out_of_max_rate' },
        { id: 'completion', label: 'dashboard.completion_rate', value: '87%', tone: 'info', subtitle: 'dashboard.last_cohort' }
      ] as DashboardCard[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'create-course', icon: 'BookmarkAddSharp', label: 'dashboard.create_course', path: '/dashboard/manage', variant: 'contained' },
        { id: 'students', icon: 'Person', label: 'dashboard.view_students', path: '/dashboard/manage', variant: 'outlined' },
        { id: 'analytics', icon: 'InsightsSharp', label: 'dashboard.analytics', path: '/dashboard/manage', variant: 'outlined' }
      ] as DashboardAction[],
      activity: activityData,
      skillDistribution,
      distribution: skillDistribution
    }
  }

  private static buildAdminDashboard(counts: DashboardCountSummary, recommendations: DashboardRecommendation[], featured: any[], activityData: any, skillDistribution: Array<{ label: string; value: number }>) {
    return {
      audience: 'admin',
      welcomeTitleFallback: 'dashboard.welcome_back',
      welcomeMessage: 'dashboard.welcome_message_user',
      currentCourseTitle: 'dashboard.your_current_courses',
      featuredTitle: 'dashboard.featured_bootcamps',
      featuredDescription: 'dashboard.featured_description',
      recommendationTitle: 'dashboard.recommendation_title',
      stat: [
        { id: 'active-courses', label: 'dashboard.active_courses', value: counts.courses, tone: 'primary', subtitle: 'dashboard.published_now' },
        { id: 'students', label: 'dashboard.total_students', value: counts.users, tone: 'success', subtitle: 'dashboard.across_all_courses' },
        { id: 'rating', label: 'dashboard.average_rating', value: '4.8', tone: 'warning', subtitle: 'dashboard.out_of_max_rate' },
        { id: 'completion', label: 'dashboard.completion_rate', value: '87%', tone: 'info', subtitle: 'dashboard.last_cohort' }
      ] as DashboardCard[],
      recommendation: recommendations,
      featured,
      action: [
        { id: 'manage', icon: 'ManageSearch', label: 'dashboard.manage_platform', path: '/dashboard/manage', variant: 'contained' },
        { id: 'bootcamps', icon: 'School', label: 'dashboard.browse_bootcamps', path: '/bootcamp', variant: 'outlined' },
        { id: 'account', icon: 'Person', label: 'dashboard.account', path: '/auth/account', variant: 'outlined' }
      ] as DashboardAction[],
      activity: activityData,
      skillDistribution,
      distribution: skillDistribution
    }
  }

  //@desc     Record a real learning activity event
  //@route    POST /dashboard/events
  //@access   PRIVATE
  @use(LogRequest)
  public static async recordLearningEvent(req: any, res: Response) {
    try {
      const { eventType, courseId, bootcampId, metadata = {} } = req.body

      if (!eventType || typeof eventType !== 'string') {
        return res.status(Code.BAD_REQUEST).json({
          success: false,
          message: 'eventType is required'
        })
      }

      const supportedEvents = ['lesson_started', 'lesson_completed', 'quiz_passed', 'assignment_submitted', 'resource_viewed', 'discussion_posted', 'login', 'badge_earned']
      if (!supportedEvents.includes(eventType)) {
        return res.status(Code.BAD_REQUEST).json({
          success: false,
          message: 'Unsupported eventType'
        })
      }

      const learningEvent = await LearningEvent.create({
        user: req.user?._id,
        course: courseId,
        bootcamp: bootcampId,
        eventType,
        metadata,
        occurredAt: new Date()
      })

      res.status(Code.CREATED).json({ success: true, data: learningEvent })
    } catch (error: any) {
      res.status(Code.BAD_REQUEST).json({
        success: false,
        message: error?.message || RESPONSE.error.FAILED_CREATE,
        error
      })
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

      const [topBootcamps, authUser, platformCourses] = await Promise.all([
        Bootcamp.find({}).sort({ rating: -1 }).limit(3).lean(),
        DashboardController.getAuthenticatedUser(req),
        Course.find({}).lean()
      ])

      const counts: DashboardCountSummary = {
        users: userCount,
        trainers: trainerCount,
        admins: adminCount,
        bootcamps: bootcampCount,
        courses: courseCount,
        feedback: feedbackCount
      }

      const locale = DashboardController.getLocale(req)
      const audience = DashboardController.getAudience(req, authUser)
      const recommendations = DashboardController.buildTopBootcampRecommendations(topBootcamps)
      const featured = DashboardController.buildFeaturedBootcamps(topBootcamps)
      const activityWindowStart = new Date()
      activityWindowStart.setDate(activityWindowStart.getDate() - 13)

      const dashboardData = await (async () => {
        if (audience === 'user' && authUser) {
          const enrollments = await Enrollment.find({ user: authUser._id }).populate({ path: 'course', select: 'title description skills' }).lean()
          const userEvents = await LearningEvent.find({ user: authUser._id, occurredAt: { $gte: activityWindowStart } }).lean()
          const activityData = DashboardController.buildActivitySeries(userEvents, locale)
          const skillDistribution = DashboardController.buildSkillDistribution(
            enrollments.map((enrollment) => ({ course: enrollment.course, progress: Number(enrollment.progress ?? 0) }))
          )
          return DashboardController.buildUserDashboard(counts, recommendations, featured, enrollments, activityData, skillDistribution)
        }

        if (audience === 'trainer' && authUser) {
          const trainerBootcamps = await Bootcamp.find({ user: authUser._id }).lean()
          const studentIds = await Enrollment.distinct('user', { bootcamp: { $in: trainerBootcamps.map((bootcamp) => bootcamp._id) } })
          const platformEvents = await LearningEvent.find({ occurredAt: { $gte: activityWindowStart } }).lean()
          const activityData = DashboardController.buildActivitySeries(platformEvents, locale)
          const skillDistribution = DashboardController.buildSkillDistribution(platformCourses.map((course) => ({ course })))
          return DashboardController.buildTrainerDashboard(counts, recommendations, featured, trainerBootcamps, studentIds.length, activityData, skillDistribution)
        }

        if (audience === 'admin') {
          const platformEvents = await LearningEvent.find({ occurredAt: { $gte: activityWindowStart } }).lean()
          const activityData = DashboardController.buildActivitySeries(platformEvents, locale)
          const skillDistribution = DashboardController.buildSkillDistribution(platformCourses.map((course) => ({ course })))
          return DashboardController.buildAdminDashboard(counts, recommendations, featured, activityData, skillDistribution)
        }

        const platformEvents = await LearningEvent.find({ occurredAt: { $gte: activityWindowStart } }).lean()
        const activityData = DashboardController.buildActivitySeries(platformEvents, locale)
        const skillDistribution = DashboardController.buildSkillDistribution(platformCourses.map((course) => ({ course })))
        return DashboardController.buildGuestDashboard(counts, recommendations, featured, activityData, skillDistribution)
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
