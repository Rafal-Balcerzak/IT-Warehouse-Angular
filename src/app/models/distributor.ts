import {ICompany} from "./company";

export interface IDistributor {
  idDistributor?: number;
  company?: ICompany | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export class Distributor implements IDistributor {
  constructor(
    public idDistributor?: number,
    public company?: ICompany | null,
    public phoneNumber?: string | null,
    public email?: string | null
  ) {
  }
}
