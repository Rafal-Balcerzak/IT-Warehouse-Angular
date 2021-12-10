import {Component, OnInit} from '@angular/core';
import {CompanyService} from "../services/company.service";
import {ICompany} from "../models/company";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {IAddress} from "../models/address";
import {CompanyUpdateComponent} from "./company-update/company-update.component";

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

  constructor(private companyService: CompanyService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllCompanies();
  }

  openAddCompany() {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = this.showCompanyUpdate;
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

  /*** Pobranie wszystkich adresów ***/
  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe(comapny => {
      this.allCompanies = comapny;
      this.companiesToShow = comapny;
      this.showCompaniesList = true;
      console.log(comapny);
    }, error => {
      console.log("Błąd pobierania firm " + error)
    })
  }

  /*** Dodanie nowej firmy ***/
  addCompany(company: ICompany) {
    this.companyService.addCompany(company).subscribe(company => {
      console.log("Dodano nową firme: " + company);
    }, error => {
      console.log("Błąd dodawania firmy " + error);
    })
  }

  /*** Usunięcie firmy po ID ***/
  deleteCompanyById(id: number) {
    this.companyService.deleteCompanyById(id).subscribe(company => {
      console.log("Usunięto firmę: " + company);
      this.refreshList();
    }, error => {
      console.log("Błąd podczas usuwania firmy: " + error);
    })
  }

  openEditCompany(companyToEdit: ICompany) {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = this.showCompanyUpdate;
    modalRef.componentInstance.companyToEdit = companyToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
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
}
