#!/bin/zsh

rm -rf tsconfig.tsbuildinfo
rm -rf dist

npm run build

pm2 start dist/app.js
