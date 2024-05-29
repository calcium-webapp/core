import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HealthModule } from "@core/health/health.module";
import { LoggerModule } from "@core/logger/logger.module";
import { DataSourceConfig } from "./config/data.source";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { ContainerModule } from "./container/container.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
       cache: true,
       envFilePath: `.env`}),
    TypeOrmModule.forRoot({...DataSourceConfig}),
    LoggerModule,
    HealthModule,
    UserModule,
    ContainerModule
  ],
})
export class AppModule {}
