import {Component, OnInit} from '@angular/core';
import {IProduct} from "../models/product";
import {ProductService} from "../services/product.service";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProductUpdateComponent} from "./product-update/product-update.component";
import {formatDate} from "@angular/common";
import {Validators} from "@angular/forms";
import {ITransaction} from "../models/transaction";
import {TransactionUpdateComponent} from "../transaction/transaction-update/transaction-update.component";
import {ICompany} from "../models/company";
import {CompanyUpdateComponent} from "../company/company-update/company-update.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  allProducts: Array<IProduct> = [];
  showProductList: boolean = false;
  showProductUpdate = true;
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  productsToShow: Array<IProduct> = [];
  startSort: boolean = false;

  constructor(private productService: ProductService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllProducts();
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

  /*** Wyszukiwanie po wpisanej frazie ***/
  search(searchTerm: any) {
    if (searchTerm !== null || true || searchTerm !== '') {
      searchTerm = searchTerm.toLowerCase();
    }
    this.productsToShow = this.allProducts.filter(product => {
      if (product.idProduct.toString().toLowerCase().indexOf(searchTerm) !== -1
        || product.productType.toLowerCase().indexOf(searchTerm) !== -1
        || product.producer.toLowerCase().indexOf(searchTerm) !== -1
        || product.model.toLowerCase().indexOf(searchTerm) !== -1
        || product.inventoryNumber.toLowerCase().indexOf(searchTerm) !== -1
        || product.price.toLowerCase().indexOf(searchTerm) !== -1
        || [formatDate(product.productionDate, 'dd.MM.yyyy', 'en'), [Validators.required]].toLocaleString().toLowerCase().indexOf(searchTerm) !== -1
        || [formatDate(product.warrantyEndDate, 'dd.MM.yyyy', 'en'), [Validators.required]].toLocaleString().toLowerCase().indexOf(searchTerm) !== -1
        || product.warrantyType.toLowerCase().indexOf(searchTerm) !== -1
        || product.inStock.toString().toLowerCase().indexOf(searchTerm) !== -1
        || product.transaction.description.toLowerCase().indexOf(searchTerm) !== -1
        || product.transaction.demand.company.name.toLowerCase().indexOf(searchTerm) !== -1) {
        return product;
      }
    })
  }

  /*** Pobranie wszytstkich product ***/
  getAllProducts() {
    this.productService.getAllProducts().subscribe(product => {
      this.allProducts = product;
      this.productsToShow = product;
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
      window.alert("Nie można usunąć powiązango produktu");
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

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.productsToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.productsToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }

    /*** Sortowanie po liczbach ***/
    if(colName.startsWith('idProduct') || colName.startsWith('price')){
      if (this.startSort == true) {
        this.productsToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.productsToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }

    /*** Sortowanie po transakcji ***/
    if(colName.startsWith('transaction')){
      let transactionCol = colName.substring(12);
      if(this.startSort == true){
        this.productsToShow.sort((a, b) => a.transaction[transactionCol] < b.transaction[transactionCol] ? 1 : a.transaction[transactionCol] > b.transaction[transactionCol] ? -1 : 0)
      }else {
        this.productsToShow.sort((a, b) => a.transaction[transactionCol] > b.transaction[transactionCol] ? 1 : a.transaction[transactionCol] < b.transaction[transactionCol] ? -1 : 0)
      }

      /*** Sortowanie po firmie ***/
      if(colName.startsWith('transaction.demand.company')){
        let companyName = colName.substring(27);
        if(this.startSort == true){
          this.productsToShow.sort((a, b) => a.transaction.demand.company[companyName] < b.transaction.demand.company[companyName] ? 1 : a.transaction.demand.company[companyName] > b.transaction.demand.company[companyName] ? -1 : 0)
        }else {
          this.productsToShow.sort((a, b) => a.transaction.demand.company[companyName] > b.transaction.demand.company[companyName] ? 1 : a.transaction.demand.company[companyName] < b.transaction.demand.company[companyName] ? -1 : 0)
        }
      }
    }

    this.startSort = !this.startSort
  }

  openTransactionDetails(transactionToEdit: ITransaction) {
    const modalRef = this.modalService.open(TransactionUpdateComponent);
    modalRef.componentInstance.showTransactionUpdate = true;
    modalRef.componentInstance.showTransactionDetails = true;
    modalRef.componentInstance.transactionToEdit = transactionToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  openCompanyDetails(companyToEdit: ICompany) {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = true;
    modalRef.componentInstance.showCompanyDetails = true;
    modalRef.componentInstance.companyToEdit = companyToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }
}
