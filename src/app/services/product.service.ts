import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IProduct} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /*** Pobranie wszytskich produktów ***/
  getAllProducts(): Observable<Array<IProduct>>{
    return this.http.get<Array<IProduct>>('http://localhost:8080/api/product');
  }

  /*** Dodanie nowego produktu ***/
  addProduct(product: IProduct): Observable<IProduct>{
    return this.http.post<IProduct>('http://localhost:8080/api/product/', product);
  }

  /*** Usunięcie produktu o danym ID ***/
  deleteProductById(id: number){
    return this.http.delete('http://localhost:8080/api/product/' + id);
  }

  /*** Edytowanie produktu ***/
  editProduct(product: IProduct): Observable<IProduct>{
    return this.http.patch<IProduct>('http://localhost:8080/api/product/',  product);
  }
}
