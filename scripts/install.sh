#!/bin/bash
apt update
apt install nodejs npm unzip cron
cd ~/fdj-draw
npm ci
