import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Company} from "../models/company";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  /*** Pobranie wszystkich firm ***/
  getAllCompanies(): Observable<Array<Company>>{
    return this.http.get<Array<Company>>('http://localhost:8080/api/company')
  }

  /*** Dodanie nowej firmy ***/
  addCompany(company: Company): Observable<Company>{
    return this.http.post<Company>('http://localhost:8080/api/company/', company);
  }
}
