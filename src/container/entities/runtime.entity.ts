import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Runtime')
export class Runtime {

    @PrimaryGeneratedColumn('increment', { name: 'runtimeId' })
    runtimeId!: number;

    @Column({ type: 'varchar', length: 30 })
    name!: string

    @Column({ type: 'varchar', length: 80 })
    description!: string
}
