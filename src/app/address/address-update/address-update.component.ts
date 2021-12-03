import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AddressService} from "../../services/address.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Address, IAddress} from "../../models/address";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-address-update',
  templateUrl: './address-update.component.html',
  styleUrls: ['./address-update.component.css']
})
export class AddressUpdateComponent implements OnInit {

  addressToEdit?: Address;
  @Output()
  refreshList = new EventEmitter<boolean>();
  showAddressUpdate?: boolean;

  editForm = this.fb.group({
    idAddress: [],
    country: [],
    region: [],
    city: [],
    street: [],
    localNumber: [],
    zipCode: []
  });

  constructor(private addressService: AddressService,
              protected fb: FormBuilder,
              protected activeModal: NgbActiveModal) {
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  ngOnInit(): void {
    if (this.addressToEdit) {
      this.updateForm();
    }
  }

  /*** Zwraca nowy adres na bazie pól z formularza ***/
  protected createFromForm(): IAddress {
    return {
      ...new Address(),
      country: this.editForm.get(['country'])!.value,
      region: this.editForm.get(['region'])!.value,
      city: this.editForm.get(['city'])!.value,
      street: this.editForm.get(['street'])!.value,
      localNumber: this.editForm.get(['localNumber'])!.value,
      zipCode: this.editForm.get(['zipCode']).value,
    };
  }

  /*** Uzupełnia pola formularza jeśli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm.patchValue({
      country: this.addressToEdit.country,
      region: this.addressToEdit.region,
      city: this.addressToEdit.city,
      street: this.addressToEdit.street,
      localNumber: this.addressToEdit.localNumber,
      zipCode: this.addressToEdit.zipCode
    })
  }

  /*** Czyśći formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      idAddress: null,
      country: null,
      region: null,
      city: null,
      street: null,
      localNumber: null,
      zipCode: null
    })
  }

  /*** Zapisuje lub edytuje adres, w zalezności od tego czy adreś do edycji został przekazany ***/
  save(refreshList): void {
    const address = this.createFromForm();
    if (this.validateInput(address)) {
      if (this.addressToEdit === null || this.addressToEdit === undefined) {
        this.addressService.addAddress(address).subscribe(address => {
          console.log("Dodano nowy adres: " + address);
          this.refreshList.emit(refreshList);
          this.cancel();
          this.clearForm();
        });
      } else {
        address.idAddress = this.addressToEdit.idAddress;
        this.addressService.editAddress(address).subscribe(address => {
          console.log("Edytowano adres: " + address);
          this.refreshList.emit(refreshList);
          this.cancel()
          this.clearForm();
        });
      }
    }
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(address: IAddress): boolean {
    let addressFieldsList = [];

    addressFieldsList.push(address.country);
    addressFieldsList.push(address.region);
    addressFieldsList.push(address.city);
    addressFieldsList.push(address.street);
    addressFieldsList.push(address.localNumber);
    addressFieldsList.push(address.zipCode);

    for (let i = 0; i < addressFieldsList.length; i++) {
      let value = addressFieldsList[i];
      if (value === '' || value === null || value === undefined || value.trim().length === 0) {
        window.alert("Wypełnij wszystkie pola.");
        console.log(value)
        return false;
      }
    }
    return true;
  }

}
