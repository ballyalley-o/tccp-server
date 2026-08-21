import GLOBAL            from '@config/global.config'
import writeSync         from 'clipboardy'
import * as PathParam    from '@config/dir.config'
import { HTML, CONTENT } from '@common/constant'

const _TEMPLATE_PARAM = {
  RESET_LINK   : '{{resetLink}}',
  USERNAME     : '{{username}}',
  EMAIL_CONTENT: '{{emailContent}}',
} as const
/**
 *  HTML content for password reset
 *
 * @param user - user object
 * @param resetToken - reset token
 * @returns - html content
 */
const htmlContent = (user: IAuthUser, resetToken: string): string | undefined => {
  if (!user || !resetToken) {
    return
  }
  const resetLink = `${GLOBAL.API_URL}/auth${PathParam.RESET_PASSWORD}/${resetToken}`
  let   result    = HTML.PASSWORD_RESET.replace(_TEMPLATE_PARAM.RESET_LINK, GLOBAL.API_HOST)
        result    = result.replace(_TEMPLATE_PARAM.USERNAME, user.firstname)
        result    = result.replace(_TEMPLATE_PARAM.EMAIL_CONTENT, CONTENT.RESET_PASSWORD_MSG)

  writeSync.writeSync(resetLink)

  return result
}

export default htmlContent
