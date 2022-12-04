cd ~/fdj-draw
docker build -t fdj-draw-container .
docker run -d -p80:3230 fdj-draw-container
