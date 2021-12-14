import {IDemand} from "./demand";
import {IDistributor} from "./distributor";

export interface ITransaction {
  idTransaction?: number;
  demand?: IDemand| null;
  distributor?: IDistributor| null;
  transactionDate?: Date| null;
  price?: string| null;
  description?: string| null;
  attachmentContentType?: string | null;
  attachment?: string | null;
}

export class Transaction implements ITransaction {
  constructor(
    public idTransaction?: number | null,
    public demand?: IDemand | null,
    public distributor?: IDistributor | null,
    public transactionDate?: Date | null,
    public price?: string | null,
    public description?: string | null,
    public attachmentContentType?: string | null,
    public attachment?: string | null
  ) {
  }
}
