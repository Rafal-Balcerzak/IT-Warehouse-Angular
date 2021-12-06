import {Component, OnInit} from '@angular/core';
import {Distributor, IDistributor} from "../../models/distributor";
import {DistributorService} from "../../services/distributor.service";
import {CompanyService} from "../../services/company.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {ICompany} from "../../models/company";
import {CompanyUpdateComponent} from "../../company/company-update/company-update.component";

@Component({
  selector: 'app-distributor-update',
  templateUrl: './distributor-update.component.html',
  styleUrls: ['./distributor-update.component.css']
})
export class DistributorUpdateComponent implements OnInit {

  distributorToEdit?: IDistributor;
  allCompanies?: Array<ICompany> = [];
  showCompanyUpdate = true;

  editForm = this.fb.group({
    idDistributor: [],
    company: [],
    phoneNumber: [],
    email: []
  })

  constructor(private distributorService: DistributorService,
              private companyService: CompanyService,
              protected activeModal: NgbActiveModal,
              private modalService: NgbModal,
              protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.distributorToEdit) {
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

  /*** Zwraca nowego dostawcę na bazie pól z formularza ***/
  protected createFromForm(): IDistributor {
    return {
      ...new Distributor(),
      company: this.editForm.get('company')!.value,
      phoneNumber: this.editForm.get('phoneNumber')!.value,
      email: this.editForm.get('email')!.value
    }
  }

  /*** Uzupełnienie formularza jeśli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm.patchValue({
      company: this.distributorToEdit.company,
      phoneNumber: this.distributorToEdit.phoneNumber,
      email: this.distributorToEdit.email
    })
  }

  /*** Czyści formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      idDistributor: null,
      company: null,
      phoneNumber: null,
      email: null
    })
  }

  /*** Zapisuje lub edytuje dostawcę, w zalezności od tego czy dostawca do edycji został przekazany ***/
  save(): void {
    const distributor = this.createFromForm();
    if (this.validateInput(distributor)) {
      if (this.distributorToEdit === null || this.distributorToEdit === undefined) {
        this.distributorService.addDistributor(distributor).subscribe(distributor => {
          console.log("Dodano nowego dostawcę: " + distributor.email);
          this.refreshListDistributor();
          this.cancel();
          this.clearForm();
        });
      } else {
        distributor.idDistributor = this.distributorToEdit.idDistributor;
        this.distributorService.editDistributor(distributor).subscribe(distributor => {
          console.log("Edytowano dostawcę: " + distributor.email);
          this.refreshListDistributor();
          this.cancel();
          this.clearForm();
        })
      }
    }
  }

  /*** Odświeżenie listy dostawców ***/
  refreshListDistributor() {
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
  validateInput(distributor: IDistributor): boolean {
    let distributorFieldsList = [];

    distributorFieldsList.push(distributor.phoneNumber);
    distributorFieldsList.push(distributor.email);

    for (let i = 0; i < distributorFieldsList.length; i++) {
      let value = distributorFieldsList[i];
      if (value === ''
        || value === null
        || value === undefined
        || value.trim().length === 0
        || distributor.company === null
        || distributor.company === undefined) {
        window.alert("Wypełnij wszystkie pola.");
        console.log(value)
        return false;
      }
    }
    return true;
  }

}
