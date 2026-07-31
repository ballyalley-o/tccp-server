module.exports = {
  preset         : 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch      : ['**/__tests__/**/*.test.ts'],
  transform      : {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig   : 'tsconfig.json',
      useESM     : true,
      diagnostics: false
    }]
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@config(.*)$'    : '<rootDir>/src/config$1',
    '^@model(.*)$'     : '<rootDir>/src/model$1',
    '^@constant(.*)$'  : '<rootDir>/src/constant$1',
    '^@decorator(.*)$' : '<rootDir>/src/decorator$1',
    '^@util(.*)$'      : '<rootDir>/src/util$1',
    '^@controller(.*)$': '<rootDir>/src/controller$1',
    '^@middleware(.*)$': '<rootDir>/src/middleware$1',
    '^@route(.*)$'     : '<rootDir>/src/route$1',
    '^@mock(.*)$'      : '<rootDir>/src/mock$1',
    '^@typings(.*)$'   : '<rootDir>/src/typings$1',
    '^@db(.*)$'        : '<rootDir>/src/db$1',
    '^@app-router(.*)$': '<rootDir>/src/app-router$1'
  }
}
