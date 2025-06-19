import { CommonEntity } from "src/common/entities/common.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { InventoryHistoryType } from "./inventory-type.enum";

@Entity()
export class InventoryHistory extends CommonEntity {
    @Column()
    public quantity: number;

    @Column({type: 'date', nullable: true})
    public expirationDate?: Date;

    @ManyToOne(() => (Product), (product: Product) => product.inventoryHistory)
    @JoinColumn()
    public product: Product

    @Column({ type: 'enum', enum: InventoryHistoryType})
    public type: InventoryHistoryType;

    @ManyToOne(() => (User), (user: User) => user.inventoryHistory)
    @JoinColumn()
    public createdBy: User;

    @Column()
    public stockAfter: number; // 입출고 이후 총 재고량
}
