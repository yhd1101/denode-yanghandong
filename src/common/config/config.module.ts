import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MYSQL_HOST: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
        MYSQL_USERNAME: Joi.string().required(),
        MYSQL_ROOT_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
      }),
    }),
  ],
})
export class AppConfigModule {}
