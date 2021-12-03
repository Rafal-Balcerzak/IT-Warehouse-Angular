import {Component, OnInit} from '@angular/core';
import {CompanyService} from "../services/company.service";
import {Company} from "../models/company";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {Address} from "../models/address";
import {AddressService} from "../services/address.service";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  allCompanies: Array<Company> = [];
  company: Company | null;
  showCompaniesList: boolean = false;
  allAddresses: Array<Address> = [];
  address: Address | null;

  constructor(private companyService: CompanyService, config: NgbModalConfig, private modalService: NgbModal, private addressService: AddressService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content) {
    if (this.allAddresses.length > 0) {
      this.modalService.open(content);
    }
  }

  ngOnInit(): void {
    this.getAllAddresses();
  }

  setAndAddCompany(name: string, nip: string) {
    this.company = ({
      name: name,
      address: this.address,
      nip: nip
    })
    this.addCompany(this.company);
    this.address = null;
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
  addCompany(company: Company) {
    this.companyService.addCompany(company).subscribe(company => {
      console.log("Dodano nową firme: " + company);
    }, error => {
      console.log("Błąd dodawania firmy " + error);
    })
  }

  /*** Pobranie wszystkich adresów ***/
  getAllAddresses() {
    this.addressService.getAllAddresses().subscribe((address: Array<Address>) => {
      this.allAddresses = address;
      console.log(address);
    }, error => {
      console.log("Błąd pobierania adresów " + error);
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllCompanies() {
    this.allCompanies = [];
    this.showCompaniesList = false;
  }
}
