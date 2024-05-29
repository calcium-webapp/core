import { Entity, BaseEntity, Column, JoinColumn, PrimaryColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity("UserDirect")
export class UserDirect extends BaseEntity {

  @PrimaryColumn({ type: 'uuid', name: 'userId' })
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId!: User;

  @Column({ type: 'varchar', length: 20, name: 'userName'})
  userName!: string;

  @Column({ type: 'varchar', length: 20})
  password!: string;
}
