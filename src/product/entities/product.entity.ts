import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { Unit } from "./unit.enum";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { InventoryHistory } from "src/inventory-history/entities/inventory-history.entity";

@Entity()
@Unique(['name', 'createdBy']) 
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

    @OneToMany(() => Inventory, (inventory: Inventory) => inventory.product)
    public inventory: Inventory[];

    @OneToMany(() => (InventoryHistory), (inventoryHistory: InventoryHistory) => inventoryHistory.product)
    public inventoryHistory: InventoryHistory[];
}
