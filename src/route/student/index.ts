import { PATH } from '@routing'
import studentRoute from '@route/student/student'

const linkStudentRoutes = (app: any) => {
  app.use(PATH.student, studentRoute)
}

export default linkStudentRoutes
