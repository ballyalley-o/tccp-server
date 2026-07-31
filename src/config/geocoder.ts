import NodeGeocoder from 'node-geocoder'
import GLOBAL       from './global'
import options      from '@util/geocoder'

const opts = options(GLOBAL.GEOCODER_API_KEY || '')
if (!GLOBAL.GEOCODER_API_KEY) {
  // fallback to OpenStreetMap provider in test/dev environments where API key is not set
  opts.provider = 'openstreetmap' as any
  // openstreetmap doesn't require apiKey
  delete (opts as any).apiKey
}

const geocoder = NodeGeocoder(opts as any)

export default geocoder
