import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAddress} from "../models/address";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) {}

  /*** Pobranie wszystkich adresów ***/
  getAllAddresses(): Observable<Array<IAddress>> {
    return this.http.get<Array<IAddress>>('http://localhost:8080/api/address');
  }

  /*** Dodanie nowego adresu ***/
  addAddress(address: IAddress): Observable<IAddress> {
    return this.http.post<IAddress>('http://localhost:8080/api/address/', address);
  }

  /*** Usunięcia adresu o danym ID ***/
  deleteAddressById(id: number) {
    return this.http.delete('http://localhost:8080/api/address/' + id);
  }

  /*** Edytowanie adresu ***/
  editAddress(address: IAddress): Observable<IAddress> {
    return this.http.patch<IAddress>('http://localhost:8080/api/address/', address);
  }

}
