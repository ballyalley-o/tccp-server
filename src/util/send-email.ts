import logger from 'logger'
import nodemailer, { SentMessageInfo, TransportOptions } from 'nodemailer'
import { transporter } from '@config/app-config'
import { IEmailOptions } from '@interface'
import { Key } from '@constant/enum'
import { GLOBAL } from '@config'
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

const sendEmail = async (options: IEmailOptions) => {
  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  const info = await transporter.sendMail(message)

  try {
    const info: SentMessageInfo = await transporter.sendMail(message)
    logger.log(Key.MessageSent, info.messageId)
  } catch (error) {
    if (error instanceof Error) {
      logger.error(Key.MessageError, error.message)
    }
  }
}

export default sendEmail
