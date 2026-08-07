#!/bin/bash
set -e
sudo apt-get update
sudo apt-get install -y nodejs npm nginx
cd /home/ubuntu/generative-ui-studio
npm install
