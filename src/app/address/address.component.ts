import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AddressService} from "../services/address.service";
import {IAddress} from "../models/address";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {AddressUpdateComponent} from "./address-update/address-update.component";
import {AddressDeleteComponent} from "./address-delete/address-delete.component";

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
  startSort: boolean = false;
  @ViewChild('alert', { static: true }) alert: ElementRef;
  showDeleteNotification?: boolean;
  showAddNotification?: boolean;
  showEditNotification?: boolean;
  idAddress?: number;

  constructor(private addressService: AddressService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllAddresses();
  }

  closeAlert() {
    this.showAddNotification = false;
    this.showEditNotification = false;
    this.showDeleteNotification = false;
  }

  openAddAddress() {
    const modalRef = this.modalService.open(AddressUpdateComponent);
    modalRef.componentInstance.showAddressUpdate = this.showAddressUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.closeAlert()
        this.showAddNotification = true;
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
        this.idAddress = addressToEdit.idAddress;
        this.closeAlert();
        this.showEditNotification = true;
      }
    })
  }

  openDeleteAddress(idToDelete: number) {
    const modalRef = this.modalService.open(AddressDeleteComponent);
    modalRef.componentInstance.showAddressDelete = true;
    modalRef.componentInstance.idToDelete = idToDelete;
    modalRef.closed.subscribe(reason => {
      if (reason === 'delete') {
        this.refreshList();
        this.idAddress = idToDelete;
        this.closeAlert()
        this.showDeleteNotification = true;
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

  /*** Pobranie wszystkich adres??w ***/
  getAllAddresses() {
    this.addressService.getAllAddresses().subscribe((address: Array<IAddress>) => {
      this.allAddresses = address;
      this.addressesToShow = address
      this.showAddressList = true;
      console.log(address);
    }, error => {
      console.log("B????d pobierania adres??w " + error);
    })
  }

  /*** Usuni??cie adresu po id ***/
  deleteAddressById(id: number) {
    this.addressService.deleteAddressById(id).subscribe(address => {
      console.log("Usuni??to adres: " + address);
      this.getAllAddresses();
    }, error => {
      console.log("B????d podczas usuwania adresu: " + error);
      window.alert("Nie mo??na usun???? powi??zanego adresu.")
    });
  }

  /*** Czy??ci liste adres??w i podmienia przycisk ***/
  clearAllAddresses() {
    this.allAddresses = [];
    this.showAddressList = false;
  }

  /*** Metoda do od??wie??ania listy adres??w ***/
  refreshList() {
    this.getAllAddresses();
  }

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.addressesToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
      this.startSort = !this.startSort
    } else {
      this.addressesToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
      this.startSort = !this.startSort
    }

    /*** Sortowanie po liczbach ***/
    if (colName.startsWith('idAddress')) {
      if (this.startSort == true) {
        this.addressesToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.addressesToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }
  }
}
