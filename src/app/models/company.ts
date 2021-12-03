import {Address} from "./address";

export interface ICompany {
  idCompany?: number;
  name?: string | null;
  address?: Address | null;
  nip?: string | null;
}

export class Company implements ICompany {
  constructor(
    public idCompany?: number,
    public name?: string | null,
    public address?: Address | null,
    public nip?: string | null
  ) {
  }

}
