import { Runtime } from "@src/enum/runtime.enum";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ContainerConnectionDto {
    
    @IsNotEmpty()
    @IsString()
    containerId!: string

    @IsOptional()
    @IsEnum(Runtime)
    @IsString()
    runtime?: Runtime

}