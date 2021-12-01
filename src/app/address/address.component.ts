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

  constructor(private addressService: AddressService) {
  }

  ngOnInit(): void {
  }

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
}
