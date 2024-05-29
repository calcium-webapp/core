import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "@src/config/base.entity";
import { ProviderSSO } from "./provider.entity";

@Entity('UserSSO')
export class UserSSO extends BaseEntity{

    @PrimaryColumn({ type: 'uuid', name: 'userId' })
    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId!: User;

    @ManyToOne(() => ProviderSSO, providerSSO => providerSSO.userSSOs)
    @JoinColumn({ name: 'providerId' })
    provider!: ProviderSSO;

    @Column({ type: 'varchar', length: 128, name: 'userProviderId' })
    userProviderId!: string;

}
