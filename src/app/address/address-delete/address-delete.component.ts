import { Component, OnInit } from '@angular/core';
import {AddressService} from "../../services/address.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-address-delete',
  templateUrl: './address-delete.component.html',
  styleUrls: ['./address-delete.component.css']
})
export class AddressDeleteComponent implements OnInit {

  showAddressDelete?: boolean;
  idToDelete?: number;

  constructor(private addressService: AddressService,
              protected activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  /*** Usunięcie adresu po przekazanym ID ***/
  deleteAddressById() {
    this.addressService.deleteAddressById(this.idToDelete).subscribe(address => {
      console.log("Usunięto adres o ID: " + this.idToDelete);
      this.refreshListAddressAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania adresu: " + error);
      window.alert("Nie można usunąć powiązanego adresu.")
    });
  }

  /*** Odswieża listę adresów po usunięciu ***/
  refreshListAddressAfterDelete() {
    this.activeModal.close('delete');
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

}
