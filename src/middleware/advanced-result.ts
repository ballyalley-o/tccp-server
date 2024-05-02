import { Request, Response, NextFunction } from 'express'
import { IPagination } from '@interface'
import { RESPONSE, REGEX, REMOVE_FIELDS } from '@constant'
import { Key } from '@constant/enum'

const advancedResult = (model: Model, populate: any) => async (req: Request, res: Response, next: NextFunction) => {
  let query = model.find()

  const reqQuery = { ...req.query }

  REMOVE_FIELDS.forEach((param) => delete reqQuery[param])
  query = query.find(reqQuery)

  if (req.query.select) {
    const fields = (req.query.select as string).split(',').join(' ')
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort(Key.Name)
  }

  const page = parseInt(req.query.page as any, 10) || 1
  const limit = parseInt(req.query.limit as any, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments(reqQuery)
  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }

  const results = await query

  const pagination: IPagination = {}
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit }
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit }
  }

  res.advancedResult = {
    success: true,
    message: RESPONSE.success[200],
    count: results.length,
    pagination,
    data: results
  }
  next()
}

export default advancedResult
