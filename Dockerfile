###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm install -g npm@10.3.0
RUN npm ci --force

COPY --chown=node:node . .

# wait-for.sh 스크립트 복사 및 실행 권한 부여
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

USER node
