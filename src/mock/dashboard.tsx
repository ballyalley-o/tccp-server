import { transl }                                                                       from "lib/tool"
import { PATH }                                                                         from "route/path"
import {
    EmojiEvents as AchievementIcon,
    TrendingUp as TrendingIcon,
    Speed as SpeedIcon,
    PersonAddSharp as PersonIcon,
    School as SchoolIcon,
    BookmarkBorder as BookmarkIcon,
    InsightsSharp as InsightsIcon,
    ManageSearch as ManageIcon,
    BookmarkAddSharp,
} from '@mui/icons-material'
import type { DashboardDataModelType, DashboardRecommendation } from "page/dashboard/dashboard"

const _SHARED_RECOMMENDATION: DashboardRecommendation[] =  [
            {
                id    : 'full-stack-web',
                title : 'Full Stack Web Development',
                meta  : 'meta.full_stack_development',
                action: 'Explore',
                path  : PATH.BOOTCAMP.ROOT,
            },
            {
                id    : 'mobile-app',
                title : 'Mobile App Development',
                meta  : 'meta.mobile_app_development',
                action: 'Explore',
                path  : PATH.BOOTCAMP.ROOT,
            },
            {
                id    : 'cloud-devops',
                title : 'Cloud & DevOps',
                meta  : 'meta.cloud_devops',
                action: 'Explore',
                path  : PATH.BOOTCAMP.ROOT,
            },
        ]

export const MOCK_DATA: DashboardDataModelType = {
    guest: {
        audience             : 'guest',
        welcomeTitleFallback : 'dashboard.welcome_back',
        welcomeMessage       : 'dashboard.welcome_message_user',
        currentCourseTitle   : 'dashboard.your_current_courses',
        currentCourseCta     : 'continue',
        featuredTitle        : 'dashboard.featured_bootcamps',
        featuredDescription  : 'dashboard.featured_description',
        recommendationTitle  : 'dashboard.recommendation_title',
        recommendation: _SHARED_RECOMMENDATION,
        action        : [
            { id: 'browse-bootcamps', icon: <SchoolIcon />, label: 'dashboard.browse_bootcamps', path: PATH.BOOTCAMP.ROOT, variant: 'contained' },
            { id: 'browse-courses', icon: <BookmarkIcon />, label: 'dashboard.browse_courses', path: PATH.COURSE.ROOT, variant: 'outlined' },
            { id: 'profile', icon: <PersonIcon />, label: 'dashboard.view_profile', path: PATH.AUTH.ACCOUNT.ROOT, variant: 'outlined' },
        ],
        activity: [
            { label: 'days.mon', value: 35 },
            { label: 'days.wed', value: 42 },
            { label: 'days.thu', value: 58 },
            { label: 'days.fri', value: 70 },
            { label: 'days.sat', value: 54 },
            { label: 'days.sun', value: 76 },
        ],
        distribution: [
            { label: 'React', value: 42 },
            { label: 'API', value: 28 },
            { label: 'Cloud', value: 18 },
            { label: transl('career'), value: 12 }
        ]
    },
    user: {
        audience             : 'user',
        welcomeTitleFallback : 'dashboard.welcome_back',
        welcomeMessage       : 'dashboard.welcome_message_user',
        currentCourseTitle   : 'dashboard.your_current_courses',
        currentCourseCta     : 'continue',
        featuredTitle        : 'dashboard.featured_bootcamps',
        featuredDescription  : 'dashboard.featured_description',
        recommendationTitle  : 'dashboard.recommendation_title',
        stat: [
            // how will the backend send this icon jsx ?
            //   { id: 'progress', icon: <AssignmentIndSharp />, label: 'dashboard.learning_progress', value: '45%', tone: 'primary', subtitle: 'dashboard.courses_active' },
              { id: 'completed', icon: <AchievementIcon />, label: 'dashboard.courses_completed', value: '3', tone: 'success', subtitle: 'dashboard.keep_it_up' },
              { id: 'streak', icon: <TrendingIcon />, label: 'dashboard.study_streak', value: '12', tone: 'warning', subtitle: 'dashboard.days_row' },
              { id: 'pace', icon: <SpeedIcon />, label: 'dashboard.average_speed', value: '95%', tone: 'info', subtitle: 'dashboard.of_target_pace' },
        ],
        recommendation: _SHARED_RECOMMENDATION,
        action        : [
            { id: 'browse-bootcamps', icon: <SchoolIcon />, label: 'dashboard.browse_bootcamps', path: PATH.BOOTCAMP.ROOT, variant: 'contained' },
            { id: 'browse-courses', icon: <BookmarkIcon />, label: 'dashboard.browse_courses', path: PATH.COURSE.ROOT, variant: 'outlined' },
            { id: 'profile', icon: <PersonIcon />, label: 'dashboard.view_profile', path: PATH.AUTH.ACCOUNT.ROOT, variant: 'outlined' },
        ],
        activity: [
            { label: 'days.mon', value: 35 },
            { label: 'days.wed', value: 42 },
            { label: 'days.thu', value: 58 },
            { label: 'days.fri', value: 70 },
            { label: 'days.sat', value: 54 },
            { label: 'days.sun', value: 76 },
        ],
        distribution: [
            { label: 'React', value: 42 },
            { label: 'API', value: 28 },
            { label: 'Cloud', value: 18 },
            { label: transl('career'), value: 12 }
        ],
        course: [
            { id: 'react-patterns', title: 'Advanced React Patterns', meta: 'TechBoot Academy', status: 'in_progress', progress: 65, tone: 'success', subtitle: 'dashboard.keep_it_up'  },
            { id: 'api-foundations', title: 'API Foundations', meta: 'CodeCoach Labs', status: 'in_progress', progress: 89, tone: 'success',  subtitle: 'dashboard.days_row' },
        ]
    },
    trainer: {
        audience             : 'trainer',
        welcomeTitleFallback : 'dashboard.welcome_back',
        welcomeMessage       : 'dashboard.welcome_message_user',
        currentCourseTitle   : 'dashboard.your_current_courses',
        currentCourseCta     : 'continue',
        featuredTitle        : 'dashboard.featured_bootcamps',
        recommendationTitle  : 'dashboard.recommendation_title',
        stat: [
            { id: 'active-courses', icon: <SchoolIcon />, label: 'dashboard.active_courses', value: '4', tone: 'primary', subtitle: 'dashboard.published_now' },
            { id: 'students', icon: <PersonIcon />, label: 'dashboard.total_students', value: '124', tone: 'success', subtitle: 'dashboard.across_all_courses' },
            { id: 'rating', icon: <AchievementIcon />, label: 'dashboard.average_rating', value: '4.8', tone: 'warning', subtitle: 'dashboard.out_of_max_rate' },
            { id: 'completion', icon: <TrendingIcon />, label: 'dashboard.completion_rate', value: '87%', tone: 'info', subtitle: 'dashboard.last_cohort'}
        ],
        action: [
            { id: 'create-course', icon: <BookmarkAddSharp />, label: 'create_course', path: PATH.AUTH.MANAGE, variant: 'contained' },
            { id: 'students', icon: <PersonIcon />, label: 'view_students', path: PATH.AUTH.MANAGE, variant: 'outlined' },
            { id: 'analytics', icon: <InsightsIcon />, label: 'analytics', path: PATH.AUTH.MANAGE, variant: 'outlined' },
        ],
        activity: [
            { label: 'days.mon', value: 68 },
            { label: 'days.tue', value: 74 },
            { label: 'days.wed', value: 71 },
            { label: 'days.thu', value: 83 },
            { label: 'days.fri', value: 87 },
            { label: 'days.sat', value: 76 },
            { label: 'days.sun', value: 81 },
        ],
        distribution: [
            { label: 'active', value: 57 },
            { label: 'at_risk', value: 14 },
            { label: 'review', value: 18 },
            { label: 'done', value: 11 },
        ],
         recommendation: _SHARED_RECOMMENDATION.map((item, index) => ({
            ...item,
            meta: `dashboard.similar_bootcamps_in_market`, index: 45 + index * 10,
            path: PATH.AUTH.MANAGE,
    })),
    },
    admin: {
        audience             : 'admin',
        welcomeTitleFallback : 'dashboard.welcome_back',
        welcomeMessage       : 'dashboard.welcome_message_user',
        currentCourseTitle   : 'dashboard.your_current_courses',
        currentCourseCta     : 'continue',
        recommendationTitle  : 'dashboard.recommendation_title',
        stat: [
            { id: 'active-courses', icon: <SchoolIcon />, label: 'dashboard.active_courses', value: '4', tone: 'primary', subtitle: 'dashboard.published_now' },
            { id: 'students', icon: <PersonIcon />, label: 'dashboard.total_students', value: '124', tone: 'success', subtitle: 'dashboard.across_all_courses' },
            { id: 'rating', icon: <AchievementIcon />, label: 'dashboard.average_rating', value: '4.8', tone: 'warning', subtitle: 'dashboard.out_of_max_rate' },
            { id: 'completion', icon: <TrendingIcon />, label: 'dashboard.completion_rate', value: '87%', tone: 'info', subtitle: 'dashboard.last_cohort'}
        ],
        action: [
              { id: 'manage', icon: <ManageIcon />, label: 'manage_platform', path: PATH.AUTH.MANAGE, variant: 'contained' },
              { id: 'bootcamps', icon: <SchoolIcon />, label: 'browse_bootcamps', path: PATH.BOOTCAMP.ROOT, variant: 'outlined' },
              { id: 'account', icon: <PersonIcon />, label: 'account', path: PATH.AUTH.ACCOUNT.ROOT, variant: 'outlined' },
        ],
        activity: [
            { label: 'days.mon', value: 72 },
            { label: 'days.tue', value: 78 },
            { label: 'days.wed', value: 74 },
            { label: 'days.thu', value: 82 },
            { label: 'days.fri', value: 88 },
            { label: 'days.sat', value: 69 },
            { label: 'days.sun', value: 75 },
        ],
        distribution: [
            { label: 'Student', value: 68 },
            { label: 'Trainer', value: 22 },
            { label: 'Admin', value: 10 },
        ],
        recommendation: _SHARED_RECOMMENDATION.map((item, index) => ({
            ...item,
            meta: `dashboard.similar_bootcamps_in_market`, index: 45 + index * 10,
            path: PATH.AUTH.MANAGE,
    })),
    }
}

