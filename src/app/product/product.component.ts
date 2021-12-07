import {Component, OnInit} from '@angular/core';
import {IProduct} from "../models/product";
import {ProductService} from "../services/product.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductUpdateComponent} from "./product-update/product-update.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  allProducts: Array<IProduct> = [];
  showProductList: boolean = false;
  showProductUpdate = true;

  constructor(private productService: ProductService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  openAddProduct() {
    const modalRef = this.modalService.open(ProductUpdateComponent);
    modalRef.componentInstance.showProductUpdate = this.showProductUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  openEditProduct(productToEdit: IProduct) {
    const modalRef = this.modalService.open(ProductUpdateComponent);
    modalRef.componentInstance.showProductUpdate = this.showProductUpdate;
    modalRef.componentInstance.productToEdit = productToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  /*** Pobranie wszytstkich product ***/
  getAllProducts() {
    this.productService.getAllProducts().subscribe(product => {
      this.allProducts = product;
      this.showProductList = true;
      console.log(product);
    }, error => {
      console.log("Błąd pobierania produktów " + error);
    })
  }

  /*** Usunięcie produktu po ID ***/
  deleteProductById(id: number) {
    this.productService.deleteProductById(id).subscribe(product => {
      console.log("Usunięto produkt: " + product);
      this.refreshList();
    }, error => {
      console.log("Błąd podczas usuwania zaopatrzenia: " + error);
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllProducts() {
    this.allProducts = [];
    this.showProductList = false;
  }

  refreshList() {
    this.getAllProducts();
  }
}
