const  _trim                             = (s: string) => s.replace(/^\/+|\/+$/g, '')
export const pathBuilder                 = (...parts: string[]) => '/' + parts.map(_trim).join('/')
export const  urlBuilder: IAppUrlBuilder = (base, ...parts) => {
  return [_trim(base), ...parts.map(_trim)].join('/')
}
