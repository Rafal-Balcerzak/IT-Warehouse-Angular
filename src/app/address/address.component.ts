import { Component, OnInit } from '@angular/core';
import {AddressService} from "../services/address.service";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  constructor(private addressService: AddressService) { }

  ngOnInit(): void {
  }

  getAllAddresses(){
    this.addressService.getAllAddresses().subscribe(address =>{
      console.log(address);
    }, error => {
      console.log("Błąd pobierania adresów " + error);
    })
  }
}
