import { Component, OnInit } from '@angular/core';
import {CompanyService} from "../services/company.service";
import {Company} from "../models/company";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  allCompanies: Array<Company> = [];
  company: Company | null = null;
  showCompaniesList: boolean = false;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
  }

  /*** Pobranie wszystkich adresów ***/
  getAllCompanies(){
    this.companyService.getAllCompanies().subscribe(comapny =>{
      this.allCompanies = comapny;
      this.showCompaniesList = true;
      console.log(comapny);
    }, error =>{
      console.log("Błąd pobierania firm " + error)
    })
  }

  clearAllCompanies() {
    this.allCompanies = [];
    this.showCompaniesList = false;
  }
}
