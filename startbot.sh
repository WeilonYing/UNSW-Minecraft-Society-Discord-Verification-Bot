#!/bin/bash

pm2 --name "Verification Bot" --max-memory-restart 200M --log ./log.txt --restart-delay 5000 --time start ./index.js

