import { Component, OnInit } from '@angular/core';
import {DistributorService} from "../../services/distributor.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-distributor-delete',
  templateUrl: './distributor-delete.component.html',
  styleUrls: ['./distributor-delete.component.css']
})
export class DistributorDeleteComponent implements OnInit {

  showDistributorDelete?: boolean;
  idToDelete?: number;

  constructor(private distributorService: DistributorService,
              protected activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  /*** Usunięcie dostawcy po ID ***/
  deleteDistributorById() {
    this.distributorService.deleteDistributorById(this.idToDelete).subscribe(distributor => {
      console.log("Usunięto dostawcę o ID: " + this.idToDelete);
      this.refreshListAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania dostawcy: " + error);
      window.alert("Nie można usunąć powiązanego dostawcy");
    })
  }

  /*** Odswieża listę po usunięciu ***/
  refreshListAfterDelete() {
    this.activeModal.close('delete');
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

}
