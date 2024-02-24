import { IHTMLContent } from '@interface'

declare interface IEmailOptions {
  /**
   * Email address to send the email to
   */
  email: string
  subject: string
  message?: string
  html?: string | IHTMLContent
}

export default IEmailOptions
