import { date } from "@hapi/joi";
import { CommonEntity } from "src/common/entities/common.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Inventory extends CommonEntity{

    @Column()
    public quantity: number;

    @Column({type: 'date', nullable: true})
    public expirationDate: Date;

    @ManyToOne(() => Product, (product: Product) => product.inventory)
    @JoinColumn()
    public product: Product;

    @ManyToOne(() => User, (user: User) => user.inventory)
    @JoinColumn()
    public createdBy: User

}
