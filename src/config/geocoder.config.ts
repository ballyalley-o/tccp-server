import NodeGeocoder from 'node-geocoder'
import options      from '@util/geocoder'
import GLOBAL       from './global.config'

const opts = options(GLOBAL.GEOCODER_API_KEY || '')
if (!GLOBAL.GEOCODER_API_KEY) {
  opts.provider = 'openstreetmap' as any
  delete (opts as any).apiKey
}

const geocoder = NodeGeocoder(opts as any)

export default geocoder
