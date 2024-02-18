import { Request, Response, NextFunction } from 'express'
import { Model } from '@typings'
import { IPagination } from '@interface'

const advancedResults =
  (model: any, populate: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let query
    //c    opy query string
    let queryStr = JSON.stringify(req.query)

    const reqQuery = { ...req.query }
    const removeFields = ['select', 'sort', 'page', 'limit']

    removeFields.forEach((param) => delete reqQuery[param])

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    //append query operators
    query = model.find(JSON.parse(queryStr))

    //select fields
    if (typeof req.query.select === 'string') {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    //sort
    const page = parseInt((req.query.page as string) || '', 10) || 1
    const limit = parseInt((req.query.limit as string) || '', 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit)

    if (populate) {
      query = query.populate(populate)
    }
    //executing query
    const results = await query

    const pagination: IPagination = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }

    // Add custom property 'advancedResults' to Response type
    interface CustomResponse extends Response {
      advancedResults: {
        success: boolean
        count: number
        pagination: IPagination
        data: Model[]
      }
    }

    // Cast 'res' to CustomResponse
    const customRes = res as CustomResponse

    customRes.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    }
    next()
  }

module.exports = advancedResults
