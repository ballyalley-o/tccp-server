import logger from 'logger'
import nodemailer, { SentMessageInfo } from 'nodemailer'
import { GLOBAL } from '@config'
import { IEmailOptions } from '@interface'
import { Key } from '@constant/enum'

const transporter = nodemailer.createTransport(GLOBAL.MAIL)

const sendEmail = async (options: IEmailOptions) => {
  let message = {
    from: GLOBAL.MAIL_FROM,
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
