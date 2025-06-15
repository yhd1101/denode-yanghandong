import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get<string>('MYSQL_HOST'),
        port: parseInt(cfg.get<string>('MYSQL_PORT'), 10),
        username: cfg.get<string>('MYSQL_USERNAME'),
        password: cfg.get<string>('MYSQL_PASSWORD'),
        database: cfg.get<string>('MYSQL_DB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
