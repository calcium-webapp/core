import { BaseEntity } from "@src/config/base.entity";
import { Column, Entity, OneToMany,PrimaryGeneratedColumn } from "typeorm";
import { UserSSO } from "./user-sso.entity";

@Entity('Provider')
export class ProviderSSO extends BaseEntity {

    @PrimaryGeneratedColumn({type: 'smallint', name: 'providerId'})
    providerId!: string

    @Column({type: 'varchar', length: 15})
    name!: string

    @OneToMany(() => UserSSO, userSSO => userSSO.provider)
    userSSOs!: UserSSO[];
}
