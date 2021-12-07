import {Component, OnInit} from '@angular/core';
import {IProduct, Product} from "../../models/product";
import {ProductService} from "../../services/product.service";
import {TransactionService} from "../../services/transaction.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {ITransaction} from "../../models/transaction";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {

  productToEdit?: IProduct;
  allTransactions: Array<ITransaction> = [];

  editForm = this.fb.group({
    idProduct: [],
    productType: [],
    producer: [],
    model: [],
    inventoryNumber: [],
    price: [],
    productionDate: [],
    warrantyEndDate: [],
    warrantyType: [],
    inStock: [],
    transaction: []
  });

  constructor(private productService: ProductService,
              private transactionService: TransactionService,
              protected activeModal: NgbActiveModal,
              protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.productToEdit) {
      this.updateForm();
    }
    this.getAllTransactions();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  /*** Zwraca nowy produkt na bazie pól z frmularza ***/
  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      productType: this.editForm.get('productType')!.value,
      producer: this.editForm.get('producer')!.value,
      model: this.editForm.get('model')!.value,
      inventoryNumber: this.editForm.get('inventoryNumber')!.value,
      price: this.editForm.get('price')!.value,
      productionDate: this.editForm.get('productionDate')!.value,
      warrantyEndDate: this.editForm.get('warrantyEndDate')!.value,
      warrantyType: this.editForm.get('warrantyType')!.value,
      inStock: this.editForm.get('inStock')!.value,
      transaction: this.editForm.get('transaction')!.value
    }
  }

  /*** Uzupełnienie formularza jeśli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm = this.fb.group({
      productType: this.productToEdit.productType,
      producer: this.productToEdit.producer,
      model: this.productToEdit.model,
      inventoryNumber: this.productToEdit.inventoryNumber,
      price: this.productToEdit.price,
      productionDate: [formatDate(this.productToEdit.productionDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      warrantyEndDate: [formatDate(this.productToEdit.warrantyEndDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      warrantyType: this.productToEdit.warrantyType,
      inStock: this.productToEdit.inStock,
      transaction: this.productToEdit.transaction
    })
  }

  /*** Czyśći formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      idProduct: null,
      productType: null,
      producer: null,
      model: null,
      inventoryNumber: null,
      price: null,
      productionDate: null,
      warrantyEndDate: null,
      warrantyTyp: null,
      inStock: null,
      transaction: null
    })
  }

  /*** Zapisuje lub edytuje produkt, w zależności od tego czy produkt do edycji został przekazany ***/
  save(): void {
    const product = this.createFromForm();
    if (this.validateInput(product)) {
      if (this.productToEdit === null || this.productToEdit === undefined) {
        this.productService.addProduct(product).subscribe(product => {
          console.log("Dodano nowy produkt: " + product);
          this.refreshListProduct();
          this.cancel();
          this.clearForm();
        });
      } else {
        product.idProduct = this.productToEdit.idProduct;
        this.productService.editProduct(product).subscribe(product => {
          console.log("Edytowano produkt: " + product);
          this.refreshListProduct();
          this.cancel();
          this.clearForm();
        });
      }
    }
  }

  /*** Odswieżenie listy produktów ***/
  refreshListProduct() {
    this.activeModal.close('save');
  }

  /*** Pobranie wszystkich transakcji ***/
  getAllTransactions() {
    this.transactionService.getAllTransactions().subscribe(transaction => {
      this.allTransactions = transaction;
      console.log(transaction);
    }, error => {
      console.log("Błąd pobierania transakcji " + error);
    })
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(product: IProduct): boolean {
    let productFieldsList = [];

    productFieldsList.push(product.productType);
    productFieldsList.push(product.producer);
    productFieldsList.push(product.model);
    productFieldsList.push(product.inventoryNumber);
    productFieldsList.push(product.price);
    productFieldsList.push(product.warrantyType);

    for (let i = 0; i < productFieldsList.length; i++) {
      let value = productFieldsList[i];
      if (value === ''
        || value === null
        || value === undefined
        || value.trim().length === 0
        || product.productionDate === null
        || product.productionDate === undefined
        || product.productionDate.toLocaleString().trim().length < 10
        || product.warrantyEndDate === null
        || product.warrantyEndDate === undefined
        || product.warrantyEndDate.toLocaleString().trim().length < 10
        || product.transaction === null
        || product.transaction === undefined) {
        window.alert("Wypełnij wszystkie pola.");
        console.log(value)
        return false;
      }
    }
    return true;
  }
}
