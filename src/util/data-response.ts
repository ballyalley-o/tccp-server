import { ObjectId } from 'mongoose'

/**
 * DataResponse class - a class to handle or model data response
 *
 * @class DataResponse
 * @template T
 * @param {T} data
 * @param {string | ObjectId} id
 *
 * @method success
 * @returns {DataResponse<T>}
 * @static
 *
 * @example
 *
 * DataResponse.success(data, id)
 * @returns {DataResponse<T>}
 *
 *
 */
class DataResponse<T> {
  constructor(public data: T, public id: string | ObjectId) {
    this.data = data
    this.id = id
  }

  public static success<T>(data: T, id: string | ObjectId) {
    return new DataResponse(data, id)
  }
}

export default DataResponse
