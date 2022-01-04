import { Component, OnInit } from '@angular/core';
import {CompanyService} from "../../services/company.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-company-delete',
  templateUrl: './company-delete.component.html',
  styleUrls: ['./company-delete.component.css']
})
export class CompanyDeleteComponent implements OnInit {

  showCompanyDelete?: boolean;
  idToDelete?: number;

  constructor(private companyService: CompanyService,
              protected activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  /*** Usunięcie firmy o przekazanym ID ***/
  deleteCompanyById() {
    this.companyService.deleteCompanyById(this.idToDelete).subscribe(company => {
      console.log("Usunięto firmę o ID: " + this.idToDelete);
      this.refreshListAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania firmy: " + error);
      window.alert("Nie można usunąć powiązanej firmy");
    })
  }

  /*** Odswieża listę firm po usunięciu ***/
  refreshListAfterDelete() {
    this.activeModal.close('delete');
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
