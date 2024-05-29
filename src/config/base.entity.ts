import { CreateDateColumn, UpdateDateColumn } from "typeorm"

export abstract class BaseEntity {

    @CreateDateColumn({
        type: 'timestamptz',
        name: 'created_at'
    })
    createdAt!: Date

    @UpdateDateColumn({
        type: 'timestamptz',
        name: 'updated_at'
    })
    updatedAt!: Date
}
