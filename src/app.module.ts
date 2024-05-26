import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HealthModule } from "@core/health/health.module";
import { LoggerModule } from "@core/logger/logger.module";
import { DockerModule } from "./docker-api/docker.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    HealthModule,
    DockerModule
  ],
})
export class AppModule {}
