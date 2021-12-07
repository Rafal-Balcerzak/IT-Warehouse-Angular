import {IProduct} from "./product";
import {IEmployee} from "./employee";

export interface IHandover {
  idHandover?: number;
  product?: IProduct | null;
  employee?: IEmployee | null;
  handoverDate?: Date | null;
}

export class Handover implements IHandover {
  constructor(
    public idHandover?: number,
    public product?: IProduct | null,
    public employee?: IEmployee | null,
    public handoverDate?: Date | null,
  ) {
  }
}
