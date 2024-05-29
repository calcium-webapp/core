import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Module } from "@nestjs/common";
import { UserSSO } from "./entities/user-sso.entity";
import { UserDirect } from "./entities/user-direct.entity";
import { ProviderSSO } from "./entities/provider.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserSSO,
            UserDirect,
            ProviderSSO]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
