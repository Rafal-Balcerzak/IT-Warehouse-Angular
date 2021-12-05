import {IAddress} from "./address";

export interface ICompany {
  idCompany?: number;
  name?: string | null;
  address?: IAddress | null;
  nip?: string | null;
}

export class Company implements ICompany {
  constructor(
    public idCompany?: number,
    public name?: string | null,
    public address?: IAddress | null,
    public nip?: string | null
  ) {
  }

}
