import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ContainerDto } from "./dto/container.dto";
import { ContainerConnectionDto } from "./dto/container.connection.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Container } from "./entities/container.entity";
import { Equal, Repository } from "typeorm";
import { User } from "@src/user/entities/user.entity";
import { Runtime } from "./entities/runtime.entity";
import { ContainerUpdateDto } from "./dto/container.update.dto";

@Injectable()
export class ContainerService {

    constructor(private readonly configService: ConfigService,
                @InjectRepository(Container) private readonly containerRepository: Repository<Container>,
                @InjectRepository(User) private readonly userRepository: Repository<User>,
                @InjectRepository(Runtime) private readonly runtimeRepository: Repository<Runtime>) {}

    async createContainer(createContainer: ContainerDto) {

        try {
            const response = await axios.post(`http://${this.configService.get("HOST")}:4000/container/create`, createContainer);

            const container = new Container();

            const user = await this.userRepository.findOne({ where: {userId: createContainer.userId} });

            if (!user) return new HttpException('User not found', HttpStatus.BAD_REQUEST);

            const runtime = await this.runtimeRepository.findOne({ where: {name: createContainer.runtime} });

            if (!runtime) return new HttpException('Runtime not found', HttpStatus.BAD_REQUEST);

            container.containerId = response.data.containerId;
            container.name = createContainer.name;
            container.userId = user;
            container.runtimeId = runtime;

            await this.containerRepository.save(container);

            return response.data;

        } catch (error) {

            console.error('Error creating container:', error);
            throw error;
        }
    }

    async startConnection(containerId: ContainerConnectionDto) {

        try {
            const response = await axios.post('http://localhost:4000/container/start', containerId);

            return response.data;

        } catch (error) {

            console.error('Error starting connection:', error);
            throw error;
        }
    }

    async deleteContainer(containerId: ContainerConnectionDto) {

        try {
            const response = await axios.post('http://localhost:4000/container/delete', containerId);

            const container = await this.containerRepository.findOne({ where: {containerId: containerId.containerId} });

            if (!container) return new HttpException('Container not found', HttpStatus.BAD_REQUEST);

            await this.containerRepository.remove(container);

            return response.data;

        } catch (error) {

            console.error('Error deleting container:', error);
            throw error;
        }
    }

    async stopContainer(containerId: ContainerConnectionDto) {

        try {
            const response = await axios.post('http://localhost:4000/container/stop', containerId);

            return response.data;

        } catch (error) {

            console.error('Error stopping container:', error);
            throw error;
        }
    }

    async getContainers(userId: string) {

        const containers = await this.containerRepository.find({ where: {userId: Equal(userId)} });

        return containers;

    }

    async updateContainer(container: ContainerUpdateDto) {

        const containerToUpdate = await this.containerRepository.findOne({ where: {name: container.name} });

        if (!containerToUpdate) return new HttpException('Container not found', HttpStatus.BAD_REQUEST);

        containerToUpdate.name = container.name;

        await this.containerRepository.save(containerToUpdate);

        return containerToUpdate;
    }
}
