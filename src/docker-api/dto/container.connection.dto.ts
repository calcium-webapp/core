import { IsNotEmpty } from "class-validator";

export class ContainerConnectionDto {
    
    @IsNotEmpty()
    containerId!: string

}