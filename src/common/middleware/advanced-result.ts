import type { Request, Response, NextFunction } from 'express'
import {
  Document,
  Model as MongooseModel,
  PopulateOptions
}                                                from 'mongoose'
import RESPONSE                                 from '@common/constant/response'
import { Code }                                 from '@common/constant/enum'
import { REMOVE_FIELDS }                        from '@common/constant/remove-fields'
import ErrorResponse                            from '@common/util/error-response'

interface Model<T extends Document> extends MongooseModel<T> {}

type PopulateConfig = string | PopulateOptions | Array<string | PopulateOptions>

type AdvancedResultOptions = {
  select ?: string[]
  sort   ?: string[]
  include?: Record<string, PopulateConfig>
}

const splitQueryParam = (value: unknown): string[] => {
  if (!value || Array.isArray(value)) {
    return []
  }

  return String(value)
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean)
}

const findUnknownFields = (requested: string[], allowed: string[]) =>
  requested.filter((field) => !allowed.includes(field.replace(/^-/, '')))

const applyPopulate = (query: ReturnType<Model<any>['find']>, populate: PopulateConfig) => {
  if (typeof populate === 'string') {
    return query.populate(populate)
  }

  return query.populate(populate)
}

const advancedResult = (
  model   : Model<any>,
  populate: PopulateConfig,
  options : AdvancedResultOptions = {}
) => async (req: Request, res: Response, next: NextFunction) => {
  const reqQuery = { ...req.query }

  const removeFields = [...REMOVE_FIELDS, 'include']
  removeFields.forEach((param) => delete reqQuery[param])

  const page       = parseInt(req.query.page as any, 10) || 1
  const limit      = parseInt(req.query.limit as any, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex   = page * limit

  let countQuery = model.countDocuments(reqQuery)
  let dataQuery  = model.find(reqQuery)

  if (req.query.select) {
    const fields = splitQueryParam(req.query.select)

    if (!options.select) {
      return next(new ErrorResponse('Select is not supported for this endpoint', Code.BAD_REQUEST))
    }

    const unknownFields = findUnknownFields(fields, options.select)
    if (unknownFields.length) {
      return next(new ErrorResponse(`Unsupported select fields: ${unknownFields.join(', ')}`, Code.BAD_REQUEST))
    }

    dataQuery = dataQuery.select(fields.join(' '))
  }

  if (req.query.sort) {
    const sortBy = splitQueryParam(req.query.sort)

    if (!options.sort) {
      return next(new ErrorResponse('Sort is not supported for this endpoint', Code.BAD_REQUEST))
    }

    const unknownFields = findUnknownFields(sortBy, options.sort)
    if (unknownFields.length) {
      return next(new ErrorResponse(`Unsupported sort fields: ${unknownFields.join(', ')}`, Code.BAD_REQUEST))
    }

    dataQuery = dataQuery.sort(sortBy.join(' '))
  } else {
    dataQuery = dataQuery.sort('name')
  }

  dataQuery = dataQuery.skip(startIndex).limit(limit)

  if (req.query.include) {
    const includes = splitQueryParam(req.query.include)

    for (const include of includes) {
      const populateOption = options.include?.[include]
      if (!populateOption) {
        return next(new ErrorResponse(`Unsupported include: ${include}`, Code.BAD_REQUEST))
      }

      dataQuery = applyPopulate(dataQuery, populateOption)
    }
  } else if (populate) {
    dataQuery = applyPopulate(dataQuery, populate)
  }

  dataQuery = dataQuery.lean()
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
