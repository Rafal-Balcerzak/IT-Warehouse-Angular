import {Component, OnInit} from '@angular/core';
import {Company, ICompany} from "../../models/company";
import {CompanyService} from "../../services/company.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddressService} from "../../services/address.service";
import {Address} from "../../models/address";
import {FormBuilder} from "@angular/forms";
import {AddressUpdateComponent} from "../../address/address-update/address-update.component";

@Component({
  selector: 'app-company-update',
  templateUrl: './company-update.component.html',
  styleUrls: ['./company-update.component.css']
})
export class CompanyUpdateComponent implements OnInit {

  companyToEdit?: Company;
  allAddresses?: Array<Address> = [];
  showCompanyUpdate?: boolean;
  showAddressUpdate = true;

  editForm = this.fb.group({
    idCompany: [],
    name: [],
    address: [],
    nip: []
  });

  constructor(private companyService: CompanyService,
              private addressService: AddressService,
              protected activeModal: NgbActiveModal,
              private modalService: NgbModal,
              protected fb: FormBuilder) {
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  ngOnInit(): void {
    if (this.companyToEdit) {
      this.updateForm();
    }
    this.getAllAddresses();
  }

  /*** Otwarcie komponentu do dodania adresu ***/
  openAddAddress(){
    const modalRef = this.modalService.open(AddressUpdateComponent);
    modalRef.componentInstance.showAddressUpdate = this.showAddressUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.getAllAddresses();
      }
    })
  }

  /*** Zwraca nowy adres na bazie pól z formularza ***/
  protected createFromForm(): ICompany {
    return {
      ...new Company(),
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      nip: this.editForm.get(['nip'])!.value
    };
  }

  /*** Uzupelnienie pola formularza jeśli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm.patchValue({
      name: this.companyToEdit.name,
      address: this.companyToEdit.address,
      nip: this.companyToEdit.nip
    })
  }

  /*** Czyści formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      name: null,
      address: null,
      nip: null
    })
  }

  /*** Zapisuje lub edytuje firmę, w zalezności od tego czy firma do edycji została przekazana ***/
  save(): void {
    const company = this.createFromForm();
    if (this.validateInput(company)) {
      if (this.companyToEdit === null || this.companyToEdit === undefined) {
        this.companyService.addCompany(company).subscribe(company => {
          console.log("Dodano nową firmę: " + company);
          this.refreshListCompany();
          this.cancel();
          this.clearForm();
        });
      } /*else {
        company.idCompany = this.companyToEdit.idCompany;
        this.companyService.editCompany(company).subscribe(company => {
          console.log("Edytowano firmę: " + company);
          this.refreshList.emit(refreshList);
          this.clearForm();
        });
      }*/
    }
  }

  /*** Odświeżenie listy firm ***/
  refreshListCompany() {
    this.activeModal.close('save');
  }

  /*** Pobranie wszystkich adresów ***/
  getAllAddresses() {
    this.addressService.getAllAddresses().subscribe((address: Array<Address>) => {
      this.allAddresses = address;
      console.log(address);
    }, error => {
      console.log("Błąd pobierania adresów " + error);
    })
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(company: ICompany): boolean {
    let companyFieldsList = [];

    companyFieldsList.push(company.name);
    companyFieldsList.push(company.nip);

    for (let i = 0; i < companyFieldsList.length; i++) {
      let value = companyFieldsList[i];
      if (value === ''
        || value === null
        || value === undefined
        || value.trim().length === 0
        || company.address === null
        || company.address === undefined) {
        window.alert("Wypełnij wszystkie pola.");
        console.log(value)
        return false;
      }
    }
    return true;
  }

}
