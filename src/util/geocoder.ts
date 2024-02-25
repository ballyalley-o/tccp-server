import { GLOBAL } from '@config'
import NodeGeocoder, { Options } from 'node-geocoder'
import { Key } from '@constant/enum'

type OptionsExtended = Options & { httpAdapter?: string }

const options = (apiKey: string): OptionsExtended => {
  return {
    provider: Key.MapQuest,
    httpAdapter: Key.HTTPAdapter,
    apiKey: apiKey || '',
    formatter: null,
  }
}

export default options
