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
  address: Address | null = null;
  showAddressList: boolean = false;

  constructor(private addressService: AddressService) {
  }

  ngOnInit(): void {
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
