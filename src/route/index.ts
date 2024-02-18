// import linkProgressRoutes from '@routes/progress'
// import linkExerciseRoutes from '@routes/exercise'
import linkStudentRoutes from '@route/user'

const mainRoute = (app: any) => {
  linkStudentRoutes(app)
}

export { mainRoute }
