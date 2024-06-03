import { Module } from "@nestjs/common";
import { DockerController } from "./docker.controller";
import { DockerService } from "./docker.service";
import { Docker } from "node-docker-api";

@Module({
    controllers: [DockerController],
    providers: [DockerService,
                {
                    provide: Docker,
                    useFactory: () => {

                        return new Docker({ socketPath: '/var/run/docker.sock' })
                    }
                }
    ]
})
export class DockerModule {}
