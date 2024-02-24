import { IUser } from '@interface/model'

interface IHTMLContent {
  (user: IUser, resetToken: string): string
}

export default IHTMLContent
