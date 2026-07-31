import type { Request, Response, NextFunction } from 'express'
import { Document, Model as MongooseModel }     from 'mongoose'
import RESPONSE                                 from '@constant/response'
import { REMOVE_FIELDS }                        from '@constant/remove-fields'
import { Key }                                  from '@constant/enum'

interface Model<T extends Document> extends MongooseModel<T> {}

const advancedResult = (model: Model<any>, populate: any) => async (req: Request, res: Response, next: NextFunction) => {
  const reqQuery = { ...req.query }

  REMOVE_FIELDS.forEach((param) => delete reqQuery[param])

  const page       = parseInt(req.query.page as any, 10) || 1
  const limit      = parseInt(req.query.limit as any, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex   = page * limit

  // Batch countDocuments and find query to avoid N+1 pattern
  let countQuery = model.countDocuments(reqQuery)
  let dataQuery  = model.find(reqQuery)

  if (req.query.select) {
    const fields    = (req.query.select as string).split(',').join(' ')
          dataQuery = dataQuery.select(fields)
  }

  if (req.query.sort) {
    const sortBy    = (req.query.sort as string).split(',').join(' ')
          dataQuery = dataQuery.sort(sortBy)
  } else {
    dataQuery = dataQuery.sort(Key.Name)
  }

  dataQuery = dataQuery.skip(startIndex).limit(limit)

  if (populate) {
    dataQuery = dataQuery.populate(populate)
  }

  // Always use lean() for read-only queries to improve performance
  dataQuery = dataQuery.lean()

  // Execute both queries in parallel to reduce latency
  const [total, results] = await Promise.all([countQuery, dataQuery])

  const pagination: IPagination = {}
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit }
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit }
  }

  res.advanceResult = {
    success: true,
    message: RESPONSE.success[200],
    count  : results.length,
    pagination,
    data: results
  }
  next()
}

export default advancedResult
