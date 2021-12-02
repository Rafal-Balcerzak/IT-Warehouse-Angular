import {Component, OnInit} from '@angular/core';
import {AddressService} from "../services/address.service";
import {Address} from "../models/address";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  allAddresses: Array<Address> = [];
  addressToEdit: Address;
  country: string;
  region: string;
  city: string;
  street: string;
  localNumber: string;
  zipCode: string;

  constructor(private addressService: AddressService, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content, address: Address) {
    this.modalService.open(content);
    this.setAddressToEdit(address);
  }

  ngOnInit(): void {
  }

  setAddressToEdit(address: Address){
    this.addressToEdit = address;
  }

  /*** Pobranie wszystkich adresów ***/
  getAllAddresses() {
    this.addressService.getAllAddresses().subscribe(address => {
      this.allAddresses = address;
      console.log(address);
    }, error => {
      console.log("Błąd pobierania adresów " + error);
    })
  }

  /*** Dodanie nowego adresu ***/
  addAddress() {
    if (this.validateInput()) {
      const newAddress: Address = ({
        country: this.country,
        region: this.region,
        city: this.city,
        street: this.street,
        localNumber: this.localNumber,
        zipCode: this.zipCode
      })
      this.addressService.addAddress(newAddress).subscribe(address => {
        console.log("Dodano nowy adres: " + address);
        this.getAllAddresses();
      }, error => {
        console.log("Błąd dodawania adresu " + error);
      })
    }
  }

  /*** Usunięcie adresu po id ***/
  deleteAddressById(id: number){
    this.addressService.deleteAddressById(id).subscribe(address =>{
      console.log("Usunięto adres: " + address);
      this.getAllAddresses();
    }, error => {
      console.log("Błąd podczas usuwania adresu: " + error);
    });
  }

  /*** Edytowanie adresu***/
  editAddress(address: Address) {
    this.addressService.editAddress(address).subscribe(address =>{
      console.log("Edytowano adres: " + address.idAddress);
      this.getAllAddresses();
    }, error => {
      console.log("Błąd podczas edytowania adresu: " + address.idAddress);
    })
  }

  clearAllAddresses() {
    this.allAddresses = [];
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(): boolean {
    let addressFieldsList = [];

    addressFieldsList.push(this.country);
    addressFieldsList.push(this.region);
    addressFieldsList.push(this.city);
    addressFieldsList.push(this.street);
    addressFieldsList.push(this.localNumber);
    addressFieldsList.push(this.zipCode);

    for(let i = 0; i < addressFieldsList.length; i++){
      let value = addressFieldsList[i];
      if (value === '' || value === null || value === undefined || value.trim().length === 0) {
        alert("Wypełnij wszystkie pola aby dodać adres");
        console.log(value)
        return false;
      }
    }
    return true;
  }

}
