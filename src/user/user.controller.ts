import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { SignUpSSODto } from "./dto/signup.sso.dto";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signUp(@Body() userData: SignUpDto) {

        return this.userService.signUp(userData);
    }

    @Post('login')
    async login(@Body() userData: LoginDto) {

        return this.userService.login(userData);
    }

    @Post("signup/sso")
    async signUpSso(@Body() userData: SignUpSSODto) {

        return this.userService.signUpSso(userData);
    }
}
