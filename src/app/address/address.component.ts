import {Component, OnInit} from '@angular/core';
import {AddressService} from "../services/address.service";
import {Address} from "../models/address";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddressUpdateComponent} from "./address-update/address-update.component";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  allAddresses: Array<Address> = [];
  address: Address | null = null;
  showAddressList: boolean = false;
  showAddressUpdate = true;

  constructor(private addressService: AddressService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  openAddAddress() {
    const modalRef = this.modalService.open(AddressUpdateComponent);
    modalRef.componentInstance.showAddressUpdate = this.showAddressUpdate;
  }

  openEditAddress(addressToEdit: Address) {
    const modalRef = this.modalService.open(AddressUpdateComponent);
    modalRef.componentInstance.showAddressUpdate = this.showAddressUpdate;
    modalRef.componentInstance.addressToEdit = addressToEdit;
  }

  /*** Pobranie wszystkich adresów ***/
  getAllAddresses() {
    this.addressService.getAllAddresses().subscribe((address: Array<Address>) => {
      this.allAddresses = address;
      this.showAddressList = true;
      console.log(address);
    }, error => {
      console.log("Błąd pobierania adresów " + error);
    })
  }

  /*** Usunięcie adresu po id ***/
  deleteAddressById(id: number) {
    this.addressService.deleteAddressById(id).subscribe(address => {
      console.log("Usunięto adres: " + address);
      this.getAllAddresses();
    }, error => {
      console.log("Błąd podczas usuwania adresu: " + error);
    });
  }

  /*** Czyści liste adresów i podmienia przycisk ***/
  clearAllAddresses() {
    this.allAddresses = [];
    this.showAddressList = false;
  }

  /*** Metoda do odświeżania listy adresów ***/
  refreshList() {
    this.getAllAddresses();
  }
}
