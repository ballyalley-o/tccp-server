import { PathDir } from '@constant'
import studentRoute from '@route/user'

const linkUserRoutes = (app: any) => {
  app.use(PathDir.USER, studentRoute)
}

export default linkUserRoutes
