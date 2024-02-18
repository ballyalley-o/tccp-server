import NodeGeocoder, { Options } from 'node-geocoder'
import { GLOBAL } from '@config'
import { Key } from '@constant/enum'

type OptionsExtended = Options & { httpAdapter?: string }

const options: OptionsExtended = {
  //   provider: GLOBAL.GEOCODER_PROVIDER || 'google',
  provider: Key.MapQuest,
  httpAdapter: Key.HTTPAdapter,
  apiKey: GLOBAL.GEOCODER_API_KEY || '',
  formatter: null,
}

const geocoder = NodeGeocoder(options)

export default geocoder
