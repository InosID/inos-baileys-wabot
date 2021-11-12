FROM node:17.1.0

RUN apt update && \
  apt install -y \
  tesseract-ocr \
  ffmpeg

COPY package.json .
RUN npm install npm@6
RUN npm install

COPY . .
EXPOSE 5000

CMD ["node", "index.js"]`
