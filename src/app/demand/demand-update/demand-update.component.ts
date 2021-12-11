import {Component, OnInit} from '@angular/core';
import {Demand, IDemand} from "../../models/demand";
import {ICompany} from "../../models/company";
import {DemandService} from "../../services/demand.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {CompanyUpdateComponent} from "../../company/company-update/company-update.component";
import {CompanyService} from "../../services/company.service";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-demand-update',
  templateUrl: './demand-update.component.html',
  styleUrls: ['./demand-update.component.css']
})
export class DemandUpdateComponent implements OnInit {

  demandToEdit?: IDemand;
  allCompanies?: Array<ICompany> = [];
  showDemandUpdate?: boolean;
  showCompanyUpdate = true;
  showDemandDetails = false;

  editForm = this.fb.group({
    idDemand: [],
    productType: [],
    model: [],
    issueDate: [],
    budget: [],
    quantity: [],
    company: []
  });

  constructor(private demandService: DemandService,
              private companyService: CompanyService,
              protected activeModal: NgbActiveModal,
              private modalService: NgbModal,
              protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.demandToEdit) {
      this.updateForm();
    }
    this.getAllCompanies();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  /*** Otwarcie komponentu do dodania firmy ***/
  openAddCompany() {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = this.showCompanyUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.getAllCompanies();
      }
    })
  }

  /*** Zwraca nowe zapotrzebowanie na bazie pól z formularza ***/
  protected createFromForm(): IDemand {
    return {
      ...new Demand(),
      productType: this.editForm.get('productType')!.value,
      model: this.editForm.get('model')!.value,
      issueDate: this.editForm.get('issueDate')!.value,
      budget: this.editForm.get('budget')!.value,
      quantity: this.editForm.get('quantity')!.value,
      company: this.editForm.get('company')!.value
    }
  }

  /*** Uzupełnienie formularza jesli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm = this.fb.group({
      productType: this.demandToEdit.productType,
      model: this.demandToEdit.model,
      issueDate: [formatDate(this.demandToEdit.issueDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      budget: this.demandToEdit.budget,
      quantity: this.demandToEdit.quantity,
      company: this.demandToEdit.company
    })
  }

  /*** Czyści formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      idDemand: null,
      productType: null,
      model: null,
      issueDate: null,
      budget: null,
      quantity: null,
      company: null
    })
  }

  /*** Zapisuje lub edytuje zapotrzebowanie, w zalezności od tego czy zapotrzebowanie do edycji zostało przekazane ***/
  save(): void {
    const demand = this.createFromForm();
    if (this.validateInput(demand)) {
      if (this.demandToEdit === null || this.demandToEdit === undefined) {
        this.demandService.addDemand(demand).subscribe(demand => {
          console.log("Dodano nowe zapotrzebowanie: " + demand.issueDate);
          this.refreshListDemand();
          this.cancel();
          this.clearForm();
        });
      } else {
        demand.idDemand = this.demandToEdit.idDemand;
        this.demandService.editDemand(demand).subscribe(demand => {
          console.log("Edytowano zapotrzebowanie: " + demand);
          this.refreshListDemand();
          this.cancel();
          this.clearForm();
        });
      }
    }
  }

  /*** Odświeżenie listy zapotrzebowań ***/
  refreshListDemand() {
    this.activeModal.close('save');
  }

  /*** Pobranie wszystkich firm ***/
  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe((company: Array<ICompany>) => {
      this.allCompanies = company;
      console.log(company);
    }, error => {
      console.log("Błąd pobierania firm " + error);
    })
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(demand: IDemand): boolean {
    let demandFieldsList = [];

    demandFieldsList.push(demand.productType);
    demandFieldsList.push(demand.model);
    demandFieldsList.push(demand.issueDate);
    demandFieldsList.push(demand.budget);

    for (let i = 0; i < demandFieldsList.length; i++) {
      let value = demandFieldsList[i];
      if (value === ''
        || value === null
        || value === undefined
        || value.trim().length === 0
        || demand.issueDate === null
        || demand.issueDate === undefined
        || demand.issueDate.toLocaleString().trim().length < 10
        || demand.quantity < 1
        || demand.company === null
        || demand.company === undefined) {
        window.alert("Wypełnij wszystkie pola.");
        console.log(value)
        return false;
      }
    }
    return true;
  }


}
