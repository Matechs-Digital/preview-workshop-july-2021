FROM node:12
ADD yarn.lock /app/yarn.lock
ADD package.json /app/package.json
ADD .next /app/.next
WORKDIR /app
RUN yarn --production --frozen-lockfile
EXPOSE 8080
ENTRYPOINT ["yarn", "next", "start", "-p", "8080", "-H", "0.0.0.0"]