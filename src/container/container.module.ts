import { Module } from "@nestjs/common";
import { ContainerController } from "./container.controller";
import { ContainerService } from "./container.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Container } from "./entities/container.entity";
import { Runtime } from "./entities/runtime.entity";
import { User } from "@src/user/entities/user.entity";
import { UserSSO } from "@src/user/entities/user-sso.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        Container,
        Runtime,
        User,
        UserSSO
    ])],
    controllers: [ContainerController],
    providers: [ContainerService],
})
export class ContainerModule {}
