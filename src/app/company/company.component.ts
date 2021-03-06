import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CompanyService} from "../services/company.service";
import {ICompany} from "../models/company";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {IAddress} from "../models/address";
import {CompanyUpdateComponent} from "./company-update/company-update.component";
import {AddressUpdateComponent} from "../address/address-update/address-update.component";
import {CompanyDeleteComponent} from "./company-delete/company-delete.component";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  allCompanies: Array<ICompany> = [];
  company: ICompany | null;
  showCompaniesList: boolean = false;
  address: IAddress | null;
  showCompanyUpdate = true;
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  companiesToShow: Array<ICompany> = [];
  startSort: boolean = false;
  @ViewChild('alert', { static: true }) alert: ElementRef;
  showDeleteNotification?: boolean;
  showAddNotification?: boolean;
  showEditNotification?: boolean;
  idCompany?: number;

  constructor(private companyService: CompanyService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllCompanies();
  }

  closeAlert() {
    this.showAddNotification = false;
    this.showEditNotification = false;
    this.showDeleteNotification = false;
  }

  openAddCompany() {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = this.showCompanyUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.closeAlert()
        this.showAddNotification = true;
      }
    })
  }

  openDeleteCompany(idToDelete: number){
    const modalRef = this.modalService.open(CompanyDeleteComponent);
    modalRef.componentInstance.showCompanyDelete = true;
    modalRef.componentInstance.idToDelete = idToDelete;
    modalRef.closed.subscribe(reason => {
      if (reason === 'delete') {
        this.refreshList();
        this.idCompany = idToDelete;
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
    this.companiesToShow = this.allCompanies.filter(company => {
      if (company.idCompany.toString().toLowerCase().indexOf(searchTerm) !== -1
        || company.name.toLowerCase().indexOf(searchTerm) !== -1
        || company.nip.toLowerCase().indexOf(searchTerm) != -1
        || company.address.city.toLowerCase().indexOf(searchTerm) !== -1
        || company.address.street.toLowerCase().indexOf(searchTerm) !== -1
        || company.address.localNumber.toLowerCase().indexOf(searchTerm) !== -1
        || company.address.zipCode.toLowerCase().indexOf(searchTerm) !== -1) {
        return company;
      }
    })

  }

  /*** Pobranie wszystkich adres??w ***/
  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe(comapny => {
      this.allCompanies = comapny;
      this.companiesToShow = comapny;
      this.showCompaniesList = true;
      console.log(comapny);
    }, error => {
      console.log("B????d pobierania firm " + error)
    })
  }

  /*** Dodanie nowej firmy ***/
  addCompany(company: ICompany) {
    this.companyService.addCompany(company).subscribe(company => {
      console.log("Dodano now?? firme: " + company);
    }, error => {
      console.log("B????d dodawania firmy " + error);
    })
  }

  /*** Usuni??cie firmy po ID ***/
  deleteCompanyById(id: number) {
    this.companyService.deleteCompanyById(id).subscribe(company => {
      console.log("Usuni??to firm??: " + company);
      this.refreshList();
    }, error => {
      console.log("B????d podczas usuwania firmy: " + error);
      window.alert("Nie mo??na usun???? powi??zanej firmy");
    })
  }

  openEditCompany(companyToEdit: ICompany) {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = this.showCompanyUpdate;
    modalRef.componentInstance.companyToEdit = companyToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.idCompany = companyToEdit.idCompany;
        this.closeAlert();
        this.showEditNotification = true;
      }
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllCompanies() {
    this.allCompanies = [];
    this.showCompaniesList = false;
  }

  refreshList() {
    this.getAllCompanies();
  }

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.companiesToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.companiesToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }

    /*** Sortowanie po liczbach ***/
    if(colName.startsWith('idCompany') || colName.startsWith('nip')){
      if (this.startSort == true) {
        this.companiesToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.companiesToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }

    /*** Sortowanie po adresie ***/
    if (colName.startsWith('address')) {
      let addressStreet = colName.substring(8);
      if (this.startSort == true) {
        this.companiesToShow.sort((a, b) => a.address[addressStreet] < b.address[addressStreet] ? 1 : a.address[addressStreet] > b.address[addressStreet] ? -1 : 0)
      } else {
        this.companiesToShow.sort((a, b) => a.address[addressStreet] > b.address[addressStreet] ? 1 : a.address[addressStreet] < b.address[addressStreet] ? -1 : 0)
      }
    }
    this.startSort = !this.startSort
  }

  openAddressDetails(addressToEdit: IAddress) {
    const modalRef = this.modalService.open(AddressUpdateComponent);
    modalRef.componentInstance.showAddressUpdate = true;
    modalRef.componentInstance.showDetails = true;
    modalRef.componentInstance.addressToEdit = addressToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }
}
