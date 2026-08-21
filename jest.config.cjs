module.exports = {
  preset         : 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch      : ['**/__tests__/**/*.test.ts'],
  transform      : {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig   : 'tsconfig.json',
        useESM     : true,
        diagnostics: false
      }
    ]
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper      : {
    '^@config(.*)$'    : '<rootDir>/src/config$1',
    '^@module(.*)$'    : '<rootDir>/src/module$1',
    '^@common(.*)$'    : '<rootDir>/src/common$1',
    '^@constant(.*)$'  : '<rootDir>/src/common/constant$1',
    '^@decorator(.*)$' : '<rootDir>/src/common/decorator$1',
    '^@util(.*)$'      : '<rootDir>/src/common/util$1',
    '^@middleware(.*)$': '<rootDir>/src/common/middleware$1',
    '^@mock(.*)$'      : '<rootDir>/src/mock$1',
    '^@def(.*)$'       : '<rootDir>/src/common/def$1',
    '^@db(.*)$'        : '<rootDir>/src/db$1',
    '^@app.router(.*)$': '<rootDir>/src/app.router$1'
  }
}
