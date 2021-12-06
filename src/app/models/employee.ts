import {ICompany} from "./company";

export interface IEmployee {
  idEmployee?: number;
  name?: string | null;
  lastName?: string | null;
  department?: string | null;
  position?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  company?: ICompany | null;
}

export class Employee implements IEmployee {
  constructor(
    public idEmployee?: number,
    public name?: string | null,
    public lastName?: string | null,
    public department?: string | null,
    public position?: string | null,
    public phoneNumber?: string | null,
    public email?: string | null,
    public company?: ICompany | null
  ) {
  }
}
