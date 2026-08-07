#!/bin/bash
set -e
cd /home/ubuntu/generative-ui-studio
PORT=3001 npm run start > /tmp/generative-ui-studio.log 2>&1 &
