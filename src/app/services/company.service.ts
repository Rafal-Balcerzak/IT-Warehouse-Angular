import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICompany} from "../models/company";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) {
  }

  /*** Pobranie wszystkich firm ***/
  getAllCompanies(): Observable<Array<ICompany>> {
    return this.http.get<Array<ICompany>>('http://localhost:8080/api/company')
  }

  /*** Dodanie nowej firmy ***/
  addCompany(company: ICompany): Observable<ICompany> {
    return this.http.post<ICompany>('http://localhost:8080/api/company/', company);
  }

  /*** Usunięcie firmy o danycm ID ***/
  deleteCompanyById(id: number) {
    return this.http.delete('http://localhost:8080/api/company/' + id);
  }

  /*** Edytowanie firmy ***/
  editCompany(company: ICompany): Observable<ICompany> {
    return this.http.patch<ICompany>('http://localhost:8080/api/company/', company);
  }
}
