cd ~/fdj-draw/api
docker build -t fdj-draw-container .
docker run -p80:3230 fdj-draw-container
