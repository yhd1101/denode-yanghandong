import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Unit } from "./unit.enum";

@Entity()
export class Product extends CommonEntity{
    @Column()
    public name: string;

    @Column({type: 'enum', enum: Unit, nullable: true})
    public unit?: Unit;

    // @Column({default: true})
    // public isActive: boolean;

    @ManyToOne(() => User, (user: User) => user.products)
    @JoinColumn()
    public createdBy: User;
}
