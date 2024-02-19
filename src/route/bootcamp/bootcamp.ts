import { Router, RequestHandler } from 'express'
import { bootcampController } from '@controller'
import { advancedResult } from '@middleware'
import { Bootcamp } from '@model'
import { Key } from '@constant/enum'
import { protect, authorize } from '@middleware'

const router = Router({ mergeParams: true })

// TODO: re-route refax
// router.use('/:bootcampId/courses', courseRouter)
// router.use('/:bootcampId/feedbacks', feedbackRouter)

router
  .route('/radius/:zipcode/:distance')
  .get(bootcampController.getBootcampsInRadius)

router
  .route('/')
  .get(bootcampController.getBootcamps)
  .post(bootcampController.createBootcamp)

router
  .route('/')
  .get(
    advancedResult(Bootcamp, Key.CourseVirtual),
    bootcampController.getBootcamps
  )

router
  .route('/create')
  .post(
    protect,
    authorize(Key.Trainer, Key.Admin),
    bootcampController.createBootcamp
  )

router
  .route('/:id')
  .get(bootcampController.getBootcamp)
  .put(
    protect,
    authorize(Key.Trainer, Key.Admin),
    bootcampController.updateBootcamp
  )
  .delete(
    protect,
    authorize(Key.Trainer, Key.Admin),
    bootcampController.deleteBootcamp
  )
