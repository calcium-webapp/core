import { Runtime } from "@src/enum/runtime.enum";
import { IsEnum, IsNotEmpty, IsNumberString } from "class-validator";

export class ContainerDto {

    @IsNotEmpty()
    name!: string;

    @IsEnum(Runtime)
    @IsNotEmpty()
    runtime!: Runtime // node, python, blank

    @IsNotEmpty()
    userId!: string
}
