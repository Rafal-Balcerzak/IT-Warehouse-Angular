import {Component, OnInit} from '@angular/core';
import {AddressService} from "../services/address.service";
import {IAddress} from "../models/address";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {AddressUpdateComponent} from "./address-update/address-update.component";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  allAddresses: Array<IAddress> = [];
  address: IAddress | null = null;
  showAddressList: boolean = false;
  showAddressUpdate = true;
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  addressesToShow: Array<IAddress> = [];
  booleanValue: boolean = false;

  constructor(private addressService: AddressService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllAddresses();
  }

  openAddAddress() {
    const modalRef = this.modalService.open(AddressUpdateComponent);
    modalRef.componentInstance.showAddressUpdate = this.showAddressUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  openEditAddress(addressToEdit: IAddress) {
    const modalRef = this.modalService.open(AddressUpdateComponent);
    modalRef.componentInstance.showAddressUpdate = this.showAddressUpdate;
    modalRef.componentInstance.addressToEdit = addressToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  /*** Wyszukiwanie po wpisanej frazie ***/
  search(searchTerm: any) {
    if (searchTerm !== null || true || searchTerm !== '') {
      searchTerm = searchTerm.toLowerCase();
    }
    this.addressesToShow = this.allAddresses.filter(address => {
      if (address.idAddress.toString().toLowerCase().indexOf(searchTerm) !== -1
        || address.country.toLowerCase().indexOf(searchTerm) !== -1
        || address.region.toLowerCase().indexOf(searchTerm) !== -1
        || address.city.toLowerCase().indexOf(searchTerm) !== -1
        || address.street.toLowerCase().indexOf(searchTerm) !== -1
        || address.localNumber.toLowerCase().indexOf(searchTerm) !== -1
        || address.zipCode.toLowerCase().indexOf(searchTerm) !== -1) {
        return address;
      }
    })
  }

  /*** Pobranie wszystkich adresów ***/
  getAllAddresses() {
    this.addressService.getAllAddresses().subscribe((address: Array<IAddress>) => {
      this.allAddresses = address;
      this.addressesToShow = address
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
      window.alert("Nie można usunąć powiązanego adresu.")
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

  /*** Sortowanie ***/
  sort(colName: string, booleanValue: boolean) {
    if (booleanValue == true){
      this.addressesToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
      this.booleanValue = !this.booleanValue
    }
    else{
      this.addressesToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
      this.booleanValue = !this.booleanValue
    }
  }
}
