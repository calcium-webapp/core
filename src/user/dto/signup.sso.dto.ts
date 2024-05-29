import { IsNotEmpty, IsString } from "class-validator"

export class SignUpSSODto {

    @IsNotEmpty()
    @IsString()
    id!: string

    @IsNotEmpty()
    @IsString()
    email!: string

    @IsNotEmpty()
    @IsString()
    provider!: string
}
