import {Component, OnInit} from '@angular/core';
import {Handover, IHandover} from "../../models/handover";
import {IEmployee} from "../../models/employee";
import {IProduct} from "../../models/product";
import {HandoverService} from "../../services/handover.service";
import {EmployeeService} from "../../services/employee.service";
import {ProductService} from "../../services/product.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-handover-update',
  templateUrl: './handover-update.component.html',
  styleUrls: ['./handover-update.component.css']
})
export class HandoverUpdateComponent implements OnInit {

  handoverToEdit?: IHandover;
  allEmployees?: Array<IEmployee> = [];
  allProducts?: Array<IProduct> = [];

  editForm = this.fb.group({
    idHandover: [],
    product: [],
    employee: [],
    handoverDate: []
  });

  constructor(private handoverService: HandoverService,
              private employeeService: EmployeeService,
              private productService: ProductService,
              protected activeModal: NgbActiveModal,
              private modalService: NgbModal,
              protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.handoverToEdit) {
      this.updateForm();
    }
    this.getAllEmployees();
    this.getAllProducts();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  /*** Zwraca nowe przekazanie na bazie pól z formularza ***/
  protected createFromForm(): IHandover {
    return {
      ...new Handover(),
      product: this.editForm.get('product')!.value,
      employee: this.editForm.get('employee')!.value,
      handoverDate: this.editForm.get('handoverDate')!.value,
    }
  }

  /*** Uzupełnienie formularza jeśli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm = this.fb.group({
      product: this.handoverToEdit.product,
      employee: this.handoverToEdit.employee,
      handoverDate: [formatDate(this.handoverToEdit.handoverDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
    })
  }

  /*** Czyści formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      product: null,
      employee: null,
      handoverDate: null
    })
  }

  /*** Zapisuje lub edytuje przekazanie, w zależności od tego czy handover do edycji zostało przekazane ***/
  save(): void {
    const handover = this.createFromForm();
    if (this.validateInput(handover)) {
      if (this.handoverToEdit === null || this.handoverToEdit === undefined) {
        this.handoverService.addHandover(handover).subscribe(handover => {
          console.log("Dodano nowe przekazanie: " + handover);
          this.refreshListHandover();
          this.cancel();
          this.clearForm();
        })
      } else {
        handover.idHandover = this.handoverToEdit.idHandover;
        this.handoverService.editHandover(handover).subscribe(handover => {
          console.log("Edytowano przekazanie: " + handover);
          this.refreshListHandover();
          this.cancel();
          this.clearForm();
        });
      }
    }
  }


  /*** Odświeżenie listy przekazań ***/
  refreshListHandover() {
    this.activeModal.close('save');
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(handover: IHandover): boolean {

    if (handover.product === null
      || handover.product === undefined
      || handover.handoverDate === null
      || handover.handoverDate === undefined
      || handover.handoverDate.toLocaleString().trim().length < 10
      || handover.employee === null
      || handover.employee === undefined
    ) {
      window.alert("Wypełnij wszystkie pola.");
      return false;
    }
    return true;
  }

  /*** Pobranie lity pracowników ***/
  private getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(employee => {
      this.allEmployees = employee;
      console.log(employee);
    }, error => {
      console.log("Błąd pobierania pracowników " + error);
    })
  }

  /*** Pobranie listy produktów ***/
  private getAllProducts() {
    this.productService.getAllProducts().subscribe(product => {
      this.allProducts = product;
      console.log(product);
    }, error => {
      console.log("Błąd pobierania produktów " + error);
    })
  }
}
