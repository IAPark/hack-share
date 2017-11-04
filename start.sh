#/bin/bash
npm install

tsc

pm2 restart ./dist/run.js