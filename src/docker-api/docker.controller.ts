import { Body, Controller, Post } from "@nestjs/common";
import { DockerService } from "./docker.service";
import { ContainerDto } from "./dto/container.dto";
import { ContainerConnectionDto } from "./dto/container.connection.dto";

@Controller("container")
export class DockerController {

    constructor(private readonly dockerService: DockerService) {}

    @Post("create")
    async createContainer(@Body() createContainer: ContainerDto) {
       
        const data: any = await this.dockerService.createContainer(createContainer);

        if (data && data["Id"] !== undefined) {

            return {

                containerId: `${data["Id"].slice(0, 12)}`
            }
        }

        return {

            message: "Bad Request",
            statusCode: 400
        }
    }

    @Post("start")
    async startConnection(@Body() containerId: ContainerConnectionDto) {

        return await this.dockerService.startConnection(containerId);
    }

    @Post("delete")
    async deleteContainer(@Body() containerId: ContainerConnectionDto) {

        return await this.dockerService.deleteContainer(containerId);
    }
}