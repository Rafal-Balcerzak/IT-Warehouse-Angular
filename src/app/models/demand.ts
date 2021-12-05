import {ICompany} from "./company";

export interface IDemand {
  idDemand?: number;
  productType?: string | null;
  model?: string | null;
  issueDate?: Date | null;
  budget?: string | null;
  quantity?: number | null;
  company?: ICompany | null;
}

export class Demand {
  constructor(
    public idDemand?: number,
    public productType?: string | null,
    public model?: string | null,
    public issueDate?: Date | null,
    public budget?: string | null,
    public quantity?: number | null,
    public company?: ICompany | null
  ) {
  }

}
