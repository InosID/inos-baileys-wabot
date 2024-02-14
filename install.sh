#!/usr/bin/bash

apt-get update
apt-get upgrade
apt-get install nodejs
apt-get install libwebp
apt-get install ffmpeg
npm install

echo "[*] All dependencies have been installed, please run the command \"npm start\" to immediately start the script"