import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ContainerDto } from "./dto/container.dto";
import { ContainerConnectionDto } from "./dto/container.connection.dto";
import { ContainerService } from "./container.service";
import { ContainerUpdateDto } from "./dto/container.update.dto";

@Controller ('container')
export class ContainerController {

    constructor(private readonly containerService: ContainerService) {}

    @Post("create")
    async createContainer(@Body() createContainer: ContainerDto) {

        return await this.containerService.createContainer(createContainer);
    }

    @Post("start")
    async startConnection(@Body() containerId: ContainerConnectionDto) {

        return await this.containerService.startConnection(containerId);
    }

    @Post("delete")
    async deleteContainer(@Body() containerId: ContainerConnectionDto) {

        return await this.containerService.deleteContainer(containerId);
    }

    @Post("stop")
    async stopContainer(@Body() containerId: ContainerConnectionDto) {

        return await this.containerService.stopContainer(containerId);
    }

    @Get("list/:id")
    async getContainers(@Param() params: any) {

            if (!params.id) return new HttpException('Missing user Id', HttpStatus.BAD_REQUEST);

            return await this.containerService.getContainers(params.id);
    }

    @Post("update")
    async updateContainer(@Body() container: ContainerUpdateDto) {

            return await this.containerService.updateContainer(container);
        }
}
