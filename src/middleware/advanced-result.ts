import { Request, Response, NextFunction } from 'express'
import { IPagination } from '@interface'
import { IResponseExtended } from '@interface'
import { IUser } from '@interface/model'
import { RESPONSE, REGEX, REMOVE_FIELDS } from '@constant'
import { Key, TYPE } from '@constant/enum'

const advancedResult =
  (model: any, populate?: any) =>
  async (
    req: Request,
    res: Response | IResponseExtended,
    next: NextFunction
  ) => {
    let query
    let queryStr = JSON.stringify(req.query)

    const reqQuery = { ...req.query }

    REMOVE_FIELDS.forEach((param) => delete reqQuery[param])

    queryStr = queryStr.replace(REGEX.MAP_LOC, (match) => `$${match}`)

    //append query operators
    query = model.find(JSON.parse(queryStr))

    // select fields
    if (req.query.select && typeof req.query.select === 'string') {
      const fields = req.query.select.split(',').join(' ') as keyof IUser
      query = query.select(fields)
    }

    if (req.query.sort && typeof req.query.sort === 'string') {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort(Key.Name)
    }

    //sort
    const page = parseInt((req.query.page as any) || '', 10) || 1
    const limit = parseInt((req.query.limit as any) || '', 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit)

    if (populate) {
      const populateString =
        typeof populate === TYPE.Function ? populate() : populate
      query = query.populate(populateString)
    }
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

    ;(res as IResponseExtended).advancedResult = {
      success: true,
      message: RESPONSE.success[200],
      count: results.length,
      pagination,
      data: results,
    }
    next()
  }

export default advancedResult
