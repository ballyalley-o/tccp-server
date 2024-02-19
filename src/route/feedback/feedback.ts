// const express = require('express')

// const {
//   getFeedbacks,
//   getFeedback,
//   addFeedback,
//   updateFeedback,
//   deleteFeedback,
// } = require('../controllers/feedbacks')

// const Feedback = require('../models/Feedback')
// const advancedResults = require('../middleware/advancedResults')

// const router = express.Router({ mergeParams: true })

// const { protect, authorize } = require('../middleware/auth')

// router
//   .route('/')
//   .get(
//     advancedResults(Feedback, {
//       path: 'bootcamp',
//       select: 'name description',
//     }),
//     getFeedbacks
//   )
//   .post(protect, authorize('student', 'admin'), addFeedback)

// router
//   .route('/:id')
//   .get(getFeedback)
//   .put(protect, authorize('student', 'admin'), updateFeedback)
//   .delete(protect, authorize('student', 'admin'), deleteFeedback)
