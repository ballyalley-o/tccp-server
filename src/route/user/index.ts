import { PathDir } from '@constant'
import studentRoute from '@route/user/user'

const linkStudentRoutes = (app: any) => {
  app.use(PathDir.USER, studentRoute)
}

export default linkStudentRoutes
