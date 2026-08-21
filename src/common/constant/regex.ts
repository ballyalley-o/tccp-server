export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  PHONE: /^[0-9]{10,11}$/,
  URL: /^(http|https):\/\/[^ "]+$/,
  MAP_LOC: /\b(gt|gte|lt|lte|in)\b/g,
} as const

export type RegexKey = keyof typeof REGEX
