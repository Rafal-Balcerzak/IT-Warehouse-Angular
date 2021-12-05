import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IDemand} from "../models/demand";

@Injectable({
  providedIn: 'root'
})
export class DemandService {

  constructor(private http: HttpClient) { }

  /*** Pobranie wszystkich zapotrzebowań ***/
  getAllDemands(): Observable<Array<IDemand>>{
    return this.http.get<Array<IDemand>>('http://localhost:8080/api/demand');
  }

  /*** Dodanie nowego zapotrzebowania ***/
  addDemand(demand: IDemand): Observable<IDemand>{
    return this.http.post<IDemand>('http://localhost:8080/api/demand/', demand);
  }

  /*** Usunięcie zapotrzebowania o danym ID ***/
  deleteDemandById(id: number){
    return this.http.delete('http://localhost:8080/api/demand/' + id);
  }

  /*** Edytowanie zapotrzebowania ***/
  editDemand(demand: IDemand): Observable<IDemand>{
    return this.http.patch<IDemand>('http://localhost:8080/api/demand/' , demand);
  }
}
