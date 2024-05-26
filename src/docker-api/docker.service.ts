import { Injectable } from "@nestjs/common";
import { Docker } from "node-docker-api";
import { ContainerDto } from "./dto/container.dto";
import { ContainerConnectionDto } from "./dto/container.connection.dto";

@Injectable()
export class DockerService {

    constructor(private readonly docker: Docker) {}

    async createContainer(createContainer: ContainerDto) {

      const container = await this.docker.container.create({
        Image: createContainer.runtime,
        name: createContainer.name,
        Tty: true
      });
      
      await container.start();

      return container.data;
          
    }

    async startConnection(containerId: ContainerConnectionDto) {

        const container = await this.docker.container.get(containerId.containerId);

        let status: any = await container.status()

        if (status.data.State.Running) {

            return {
                
                terminal: `ws://localhost:2375/containers/${containerId.containerId}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`
            }
        }

        else {

          try {
            
            await container.start();

            return {
                
                terminal: `ws://localhost:2375/containers/${containerId.containerId}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`
            }

          } catch (error) {

            return {
                
                message: "Container not found",
                statusCode: 404
            }
          }

          
        }
    }

    async deleteContainer(containerId: ContainerConnectionDto) {
        
          const container = await this.docker.container.get(containerId.containerId);
  
          await container.stop();
  
          await container.delete({ force: true });

          return "Container deleted successfully!"
      }
    
    async stopContainer(containerId: ContainerConnectionDto) {
          
          const container = await this.docker.container.get(containerId.containerId);
  
          await container.stop();
  
          return "Container stopped successfully!"
      }
}