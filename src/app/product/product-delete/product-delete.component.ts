import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-delete',
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.css']
})
export class ProductDeleteComponent implements OnInit {

  showProductDelete?: boolean;
  idToDelete?: any;

  constructor(private productService: ProductService,
              protected activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  /*** Usunięcie produktu po ID ***/
  deleteProductById() {
    this.productService.deleteProductById(this.idToDelete).subscribe(product => {
      console.log("Usunięto produkt o ID: " + this.idToDelete);
      this.refreshListAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania zaopatrzenia: " + error);
      window.alert("Nie można usunąć powiązango produktu");
    })
  }

  /*** Odswieża listę po usunięciu ***/
  refreshListAfterDelete() {
    this.activeModal.close('delete');
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

}
