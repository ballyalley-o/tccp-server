import { HTML, CONTENT } from '@constant'
import { PathParam, Key } from '@constant/enum'
import { IUser } from '@interface/model'
import { GLOBAL } from '@config'
import writeSync from 'clipboardy'

/**
 *  HTML content for password reset
 *
 * @param user - user object
 * @param resetToken - reset token
 * @returns - html content
 */
const htmlContent = (user: IUser, resetToken: string): string | undefined => {
  if (!user || !resetToken) {
    return
  }
  const resetLink = `${GLOBAL.API_URL}/auth${PathParam.RESET_PASSWORD}/${resetToken}`
  let result = HTML.PASSWORD_RESET.replace(Key.ResetLink, GLOBAL.API_HOST)
  result = result.replace(Key.Username, user.firstname)
  result = result.replace(Key.EmailContent, CONTENT.RESET_PASSWORD_MSG)

  writeSync.writeSync(resetLink)

  return result
}

export default htmlContent
