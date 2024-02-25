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

  /**
   * @Success response
   */
  success: {
    200: 'OK: Request fetched',
    201: 'CREATED: Request created',
    204: 'NO CONTENT: The server successfully processed the request but there is no content to send in the response.',
    PHOTO_UPLOADED: 'OK: Photo Uploaded',
    AVATAR_UPLOADED: 'OK: Avatar Uploaded',
    COURSES_DELETED: (data: string) =>
      `Courses being deleted from bootcamp ID: ${data}. Reload page to see the effect`,
    COLLECTION_SEED: ' MOCK MIGRATION SUCCESSFUL 🌱 ',
    COLLECTION_DESTROYED: ' COLLECTION/s DESTROYED 💥 ',
    LOGOUT: `User logged out`,
    UPDATED: `Entity updated`,
    DELETED: `Entity deleted`,
    EMAIL_SENT: 'Email sent',
  },

  /**
   * @Error response
   */
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
    NOT_FOUND_COURSE: (data: string) => `Course not found with id of ${data}`,
    NOT_FOUND_BOOTCAMP: (data: string) =>
      `Bootcamp not found with id of ${data}`,
    NOT_FOUND_FEEDBACK: (data: string) =>
      `No feedback found with the id ${data}`,
    NOT_FOUND: (data: string) => `There is no user with id ${data}`,
    BOOTCAMP_ALREADY_PUBLISHED: (data: string) =>
      `The user with ID ${data} has already published a bootcamp`,
    FAILED_UPLOAD: ' Please upload a file ',
    FAILED_UPLOAD_AVATAR: ' Please upload an avatar ',
    FAILED_FILESIZE: (fileSize: number) =>
      `File size cannot exceed ${fileSize}`,
    FAILED_SEED: ' FAILED TO SEED COLLECTION/s SEED ',
    FAILED_DESTROY: ' FAILED TO DESTROY COLLECTION/s ',
    INVALID_CREDENTIAL: 'Please provide a valid email and password',
    INVALID_TOKEN: 'Invalid token',
    NOT_OWNER: (user: string, course: string) =>
      `User ${user} is unauthorized to update course ${course}`,
    ROLE_NOT_ALLOWED: (data: string) =>
      `Current role ${data} is unauthorized to access this route`,
    parseErr: (err: any) => `Error parsing JSON: ${err}`,
    NotInstance: 'This class cannot be instantiated',
    STATIC_CLASS: 'This is a static class',
    FAILED_EMAIL: 'Email could not be sent',
    RESET_SUBJECT: 'Password Reset Request',
    RESET_MESSAGE: (resetUrl: string) =>
      `A request has been made to reset your password. If you made this request, please copy the following code into the prompt in: \n\n ${resetUrl} to verify your identity.`,
  },
}

export default RESPONSE
