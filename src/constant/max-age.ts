const maxAge = {
  one_hr: 60 * 60 * 1000,
  two_hr: 2 * 60 * 60 * 1000,
  six_hr: 6 * 60 * 60 * 1000,
  1: 24 * 60 * 60 * 1000,
  30: 30 * 24 * 60 * 60 * 1000,
}

const expire = new Date(0)
const oneHr = maxAge.one_hr
const twoHr = maxAge.two_hr
const sixHr = maxAge.six_hr
const oneDay = maxAge[1]
const thirtyDays = maxAge[30]

export { expire, oneHr, twoHr, sixHr, oneDay, thirtyDays }
