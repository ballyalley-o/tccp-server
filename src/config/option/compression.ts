import compression from 'compression'

export const compressionOption = () => {
    return {
          threshold: 1024,
          level    : 6,
          filter   : (req, res) => {
            if (req.headers['x-no-compression']) {
              return false
            }
            return compression.filter(req, res)
          }
    } as compression.CompressionOptions
}