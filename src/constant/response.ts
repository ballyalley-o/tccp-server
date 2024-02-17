import { Request, Response } from 'express'
import { GLOBAL } from '@config'

const RESPONSE = {
  server: (req: Request, res: Response) => {
    const response = {
      name: GLOBAL.APP_NAME,
      status: 'Running',
      appServerName: GLOBAL.APP_SERVER_NAME,
      version: GLOBAL.API_VERSION,
      url: GLOBAL.API_URL,
      port: GLOBAL.PORT,
      environment: GLOBAL.ENV,
    }
    res.send(response)
  },
  exists: (data: string) => `${data} already exists`,
  dbSaved: (data: string) => `new ${data} has been saved to the database`,

  success: {
    200: 'OK: Request fetched',
    201: 'CREATED: Request created',
    204: 'NO CONTENT: The server successfully processed the request but there is no content to send in the response.',
    COLLECTION_SEED: ' COLLECTION/s SEED SUCCESSFUL 🌱 ',
    COLLECTION_DESTROYED: ' COLLECTION/s DESTROYED 💥 ',
  },
  error: {
    400: 'BAD REQUEST: Client request is Invalid',
    401: 'UNAUTHORIZED: Request cannot be granted unless Client is Authenticated',
    403: 'FORBIDDEN: Necessary permissions is required to access the Requested Resource',
    404: 'NOT FOUND: Resource requested cannot be found',
    422: 'UNPROCESSABLE ENTITY: The data submitted in a form is in the wrong format or is missing required fields',
    429: 'REQUEST OVERLOAD: Throttling limit exceeded for an API',
    500: 'INTERNAL SERVER ERROR: Server encountered an Unhandled Exception',
    503: 'SERVICE UNAVAILABLE: The server is temporarily unable to handle the Request',
    504: 'GATEWAY TIMEOUT: The server acting as a gateway did not receive a timely response from an upstream server',
    FAILED_SEED: ' FAILED TO SEED COLLECTION/s SEED ',
    FAILED_DESTROY: ' FAILED TO DESTROY COLLECTION/s ',

    parseErr: (err: any) => `Error parsing JSON: ${err}`,
    NotInstance: 'This class cannot be instantiated',
  },
}

export default RESPONSE
