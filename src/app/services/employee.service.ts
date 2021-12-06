import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IEmployee} from "../models/employee";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  /*** Pobranie wszytskich pracowników ***/
  getAllEmployees(): Observable<Array<IEmployee>>{
    return this.http.get<Array<IEmployee>>('http://localhost:8080/api/employee');
  }

  /*** Dodanie nowego pracownika ***/
  addEmployee(employee: IEmployee): Observable<IEmployee>{
    return this.http.post<IEmployee>('http://localhost:8080/api/employee/', employee);
  }

  /*** Usunięcie pracownika o danym ID ***/
  deleteEmployeeById(id: number){
    return this.http.delete('http://localhost:8080/api/employee/' + id);
  }

  /*** Edytowanie pracownika ***/
  editEmployee(employee: IEmployee): Observable<IEmployee>{
    return this.http.patch<IEmployee>('http://localhost:8080/api/employee/', employee);
  }
}
