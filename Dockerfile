# FROM node:12.12-alpine
# WORKDIR /task-manager-api
# COPY package.json /task-manager-api
# RUN npm install
# COPY . /task-manager-api
# CMD ["npm", "start"]
# build docker from terminal image by issuing: 
# docker build -t task-manager-docker . "the dot is the path to where our app is in the case . means same dir"
# docker run -it -p 9000:3000 task-mamanger-docker   "-it: means it gives us an interactive terminal as part of the docker image, also -p points our local 3000 port to 9000 used by the docker."
# to run docker in background, run it with -d options: that's detached mode
# docker run -d -p 9000:3000 task-mamanger-docker
# list docker images running: docker ps
# use nodemon to automate creation of images with lates changes in code
# docker run -it -p 90001:3000 -v $(pwd):/task-manager-api task-manager-docker