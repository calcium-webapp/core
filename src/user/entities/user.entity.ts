import { BaseEntity } from "@src/config/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('User')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid', { name: 'userId' })
    userId!: string

    @Column({type: 'varchar', length: 100, unique: true})
    email!: string
}
