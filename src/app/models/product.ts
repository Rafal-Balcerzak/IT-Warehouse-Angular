import {ITransaction} from "./transaction";

export interface IProduct {
  idProduct?: number;
  productType?: string | null;
  producer?: string | null;
  model?: string | null;
  inventoryNumber?: string | null;
  price?: string | null;
  productionDate?: Date | null;
  warrantyEndDate?: Date | null;
  warrantyType?: string | null;
  inStock?: boolean | null;
  transaction?: ITransaction | null;
}

export class Product implements IProduct {
  constructor(
    public idProduct?: number,
    public product_type?: string | null,
    public producer?: string | null,
    public model?: string | null,
    public inventoryNumber?: string | null,
    public price?: string | null,
    public productionDate?: Date | null,
    public warrantyEndDate?: Date | null,
    public warrantyType?: string | null,
    public inStock?: boolean | null,
    public transaction?: ITransaction | null
  ) {
  }
}
