import {Component, OnInit} from '@angular/core';
import {CompanyService} from "../services/company.service";
import {ICompany} from "../models/company";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
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

  constructor(private companyService: CompanyService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
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

  /*** Pobranie wszystkich adresów ***/
  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe(comapny => {
      this.allCompanies = comapny;
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


}
