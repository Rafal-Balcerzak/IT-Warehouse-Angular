import {Address} from "./address";

export interface Company {
  idCompany?: number;
  name?: string | null;
  address: Address | null;
  nip: string | null;
}
