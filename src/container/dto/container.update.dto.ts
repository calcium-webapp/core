import { IsNotEmpty, IsString } from "class-validator";

export class ContainerUpdateDto {

    @IsNotEmpty()
    @IsString()
    name!: string

    @IsNotEmpty()
    @IsString()
    newName!: string
}
