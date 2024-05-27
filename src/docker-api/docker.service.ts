import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Docker } from "node-docker-api";
import { ContainerDto } from "./dto/container.dto";
import { ContainerConnectionDto } from "./dto/container.connection.dto";
import { RuntimeExtensions } from "@src/constants/extension.constant";
import { Readable } from "stream";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DockerService {

    constructor(private readonly docker: Docker,
                private readonly configService: ConfigService
    ) {}

    async createContainer(createContainer: ContainerDto) {

      const container = await this.docker.container.create({
        Image: createContainer.runtime,
        name: createContainer.name,
        Tty: true,
        OpenStdin: true
      });

      await container.start();

      return container.data;

    }

    async startConnection(containerId: ContainerConnectionDto) {

      const container = await this.docker.container.get(containerId.containerId);

      let status: any = await container.status();

      if (!containerId.runtime) {
        throw new HttpException('Runtime is not valid or not present', HttpStatus.BAD_REQUEST);
      }

      const cmd = {
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Cmd: ['bash', '-c', "node /home/scripts/client.js"],
        Env: [
          `ROOM=codeeditor:${containerId.containerId}`,
          "WORKSPACE=/usr/my-workspace",
          `EXTENSION=${RuntimeExtensions[containerId.runtime]}`],
        Privileged: true,
        User: "root"
      }

      const _cmd = {
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['bash', '-c', "ps aux | grep [c]lient.js"]
      }

        if (status.data.State.Running) {

          const exec = await container.exec.create(_cmd);
          const execStart = await exec.start({ hijack: true, stdin: true });
          const output = await getStreamOutput(execStart as Readable);

          if (output === "") {

            const exec = await container.exec.create(cmd);
            await exec.start({ hijack: true, stdin: true });

          }

          return {
            terminal: `ws://${this.configService.get("HOST")}:2375/containers/${containerId.containerId}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`
          }
        }

        else {

          try {

            await container.start();

            const exec = await container.exec.create(cmd);
            await exec.start({ hijack: true, stdin: true })

            return {

                terminal: `ws://${this.configService.get("HOST")}:2375/containers/${containerId.containerId}/attach/ws?stream=1&stdout=1&stdin=1&logs=1`
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

  async function getStreamOutput(stream: Readable): Promise<string> {

    return new Promise((resolve, reject) => {

      let output = '';

      stream.on('data', (data) => {

        output += data.toString();

      });
      stream.on('end', () => {

        resolve(output);

      });
      stream.on('error', (err) => {

        reject(err);

      });
    });
  }
