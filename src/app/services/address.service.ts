import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Address} from "../models/address";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  /*** Pobranie wszystkich adresów ***/
  getAllAddresses(): Observable<Array<Address>>{
    return this.http.get<Array<Address>>('http://localhost:8080/api/address');
  }

  /*** Dodanie nowego adresu ***/
  addAddress(address: Address): Observable<Address>{
    return this.http.post<Address>('http://localhost:8080/api/address/', address);
  }
}
