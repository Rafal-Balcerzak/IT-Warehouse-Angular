import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ITransaction} from "../models/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  /*** Pobranie wszystkich transakcji ***/
  getAllTransactions(): Observable<Array<ITransaction>>{
    return this.http.get<Array<ITransaction>>('http://localhost:8080/api/transaction');
  }

  /*** Dodanie nowej transakcji ***/
  addTransaction(transaction: ITransaction): Observable<ITransaction>{
    return this.http.post<ITransaction>('http://localhost:8080/api/transaction/', transaction);
  }

  /*** Usunięcie transakcji o danym ID ***/
  deleteTransactionById(id: number){
    return this.http.delete("http://localhost:8080/api/transaction/" + id);
  }

  /*** Edytowanie transakcji ***/
  editTransaction(transaction: ITransaction): Observable<ITransaction>{
    return this.http.patch<ITransaction>('http://localhost:8080/api/transaction/', transaction);
  }
}
