import {Component, OnInit} from '@angular/core';
import {AddressService} from "../services/address.service";
import {Address} from "../models/address";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  allAddresses: Array<Address> = [];
  country: string;
  region: string;
  city: string;
  street: string;
  localNumber: string;
  zipCode: string;

  constructor(private addressService: AddressService) {
  }

  ngOnInit(): void {
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
