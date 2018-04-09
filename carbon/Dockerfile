FROM node:carbon

# Create app directory
WORKDIR /var/www/ntifs

COPY ./src /var/www/ntifs

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

CMD [ "npm", "start" ]
