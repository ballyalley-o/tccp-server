declare global {
  namespace Mongoose {
    interface Schema {
      Types: {
        ObjectId: any
      }
    }
  }
}

type Model = IBootcamp | IUser | IDefault | ICourse | ICourseExtended | IFeedback | IFeedbackExtended
