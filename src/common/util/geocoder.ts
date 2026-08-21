import { Options } from 'node-geocoder'

type OptionsExtended = Options & { httpAdapter?: string }

const options = (apiKey: string): OptionsExtended => {
  return {
    provider   : 'mapquest',
    httpAdapter: 'https',
    apiKey     : apiKey || '',
    formatter  : null,
  }
}

export default options
