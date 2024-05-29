import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SignUpDto } from "./dto/signup.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserDirect } from "./entities/user-direct.entity";
import { UserSSO } from "./entities/user-sso.entity";
import { LoginDto } from "./dto/login.dto";
import { SignUpSSODto } from "./dto/signup.sso.dto";
import { ProviderSSO } from "./entities/provider.entity";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userService: Repository<User>,
                @InjectRepository(UserDirect) private readonly userDirectService: Repository<UserDirect>,
                @InjectRepository(UserSSO) private readonly userSsoService: Repository<UserSSO>,
                @InjectRepository(ProviderSSO) private readonly providerSsoService: Repository<ProviderSSO>) {}

    async signUp(userData: SignUpDto) {

        const existingUser = await this.userService.findOne({ where: { email: userData.email } });

        if (existingUser) return new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

        const user = new User();

        user.email = userData.email;

        await this.userService.save(user);

        const userDirect = new UserDirect();

        userDirect.userId = user;
        userDirect.userName = userData.userName;
        userDirect.password = userData.password;

        await this.userDirectService.save(userDirect);

        return user;
    }

    async login(userData: LoginDto) {

        const user = await this.userDirectService.findOne({ where: { userName: userData.userName } });

        if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);

        if (user.password !== userData.password) return new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

        return {

            userId: user.userId,
            userName: user.userName,
        };
    }

    async signUpSso(userData: SignUpSSODto) {

        const existingUser = await this.userService.findOne({ where: { email: userData.email } });

        if (existingUser) return;

        const user = new User();

        user.email = userData.email;

        await this.userService.save(user);

        const userSso = new UserSSO();

        const provider = await this.providerSsoService.findOne({ where: { name: userData.provider } });

        if (!provider) throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);

        userSso.userId = user;
        userSso.provider = provider;
        userSso.userProviderId = userData.id;

        await this.userSsoService.save(userSso);

        return userSso;
    }
}
