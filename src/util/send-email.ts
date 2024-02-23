import { App } from '@config'
import goodlog from 'good-logs'
import { SentMessageInfo } from 'nodemailer'
import { IEmailOptions } from '@interface'
import { Key } from '@constant/enum'
import dotenv from 'dotenv'
dotenv.config()

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// } as TransportOptions)
// export const message = (from: string, options: any) => {
//   return {
//     from: from,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   }
// }

const sendEmail = async (options: IEmailOptions) => {
  const info = await App.transporter.sendMail(App.message(options))

  try {
    const info: SentMessageInfo = await App.transporter.sendMail(
      App.message(options)
    )
    goodlog.log(Key.MessageSent, info.messageId)
  } catch (error) {
    if (error instanceof Error) {
      goodlog.error(Key.MessageError, error.message)
    }
  }
}

export default sendEmail
