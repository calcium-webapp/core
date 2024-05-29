import { BaseEntity } from "@src/config/base.entity"
import { User } from "@src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Runtime } from "./runtime.entity";

@Entity('Container')
export class Container extends BaseEntity {

    @PrimaryColumn({ type: 'varchar', name: 'containerId' })
    containerId!: string;

    @Column({ type: 'varchar', length: 30 })
    name!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId!: User

    @ManyToOne(() => Runtime)
    @JoinColumn({ name: 'runtimeId' })
    runtimeId!: Runtime
}
