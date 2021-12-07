import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IHandover} from "../models/handover";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HandoverService {

  constructor(private http: HttpClient) {
  }

  /*** Pobranie wszystkich przekazań ***/
  getAllHandovers(): Observable<Array<IHandover>> {
    return this.http.get<Array<IHandover>>('http://localhost:8080/api/handover');
  }

  /*** Dodanie nowego przekazania ***/
  addHandover(handover: IHandover): Observable<IHandover> {
    return this.http.post<IHandover>('http://localhost:8080/api/handover/', handover);
  }

  /*** Usunięcie przekazania o danym ID ***/
  deleteHandoverById(id: number) {
    return this.http.delete('http://localhost:8080/api/handover/' + id);
  }

  /*** Edytowanie przekazania ***/
  editHandover(handover: IHandover): Observable<IHandover> {
    return this.http.patch<IHandover>('http://localhost:8080/api/handover/', handover);
  }
}
