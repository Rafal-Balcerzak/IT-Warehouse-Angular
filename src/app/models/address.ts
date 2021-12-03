export interface IAddress {
  idAddress?: number;
  country?: string | null,
  region?: string | null,
  city?: string | null,
  street?: string | null,
  localNumber?: string | null,
  zipCode?: string | null
}

export class Address implements IAddress {
  constructor(
    public idAddress?: number,
    public country?: string | null,
    public region?: string | null,
    public city?: string | null,
    public street?: string | null,
    public localNumber?: string | null,
    public zipCode?: string | null
  ) {
  }
}
