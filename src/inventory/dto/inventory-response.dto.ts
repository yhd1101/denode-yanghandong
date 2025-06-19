import { Inventory } from "../entities/inventory.entity";

export class InventoryResponseDto {
    id: string;
    quantity: number;
    expirationDate: Date;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(inventory: Inventory) {
      this.id = inventory.id;
      this.quantity = inventory.quantity;
      this.expirationDate = inventory.expirationDate;
      this.createdAt = inventory.createdAt;
      this.updatedAt = inventory.updatedAt;
    }
  }
  