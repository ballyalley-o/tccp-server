export interface IConNex {
  (...params: any[]): string
}

export interface IIsConnected {
  isConnected: boolean
  [key: string]: any
}
