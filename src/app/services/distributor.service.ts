import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IDistributor} from "../models/distributor";

@Injectable({
  providedIn: 'root'
})
export class DistributorService {

  constructor(private http: HttpClient) {
  }

  /*** Pobranie wszystkich dostawców ***/
  getAllDistributors(): Observable<Array<IDistributor>> {
    return this.http.get<Array<IDistributor>>('http://localhost:8080/api/distributor');
  }

  /*** Dodanie nowego dostawcy ***/
  addDistributor(distributor: IDistributor): Observable<IDistributor> {
    return this.http.post<IDistributor>('http://localhost:8080/api/distributor/', distributor);
  }

  /*** Usunięcie dostawcy o danym ID ***/
  deleteDistributorById(id: number) {
    return this.http.delete('http://localhost:8080/api/distributor/' + id);
  }

  /*** Edytowanie dostawcy ***/
  editDistributor(distributor: IDistributor): Observable<IDistributor> {
    return this.http.patch<IDistributor>('http://localhost:8080/api/distributor/', distributor);
  }
}
