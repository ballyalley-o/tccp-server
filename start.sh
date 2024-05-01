#!/bin/zsh

rm -rf tsconfig.tsbuildinfo
rm -rf dist

npm run build

npm run start:run