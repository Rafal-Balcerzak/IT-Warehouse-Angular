import { Component, OnInit } from '@angular/core';
import {HandoverService} from "../../services/handover.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-handover-delete',
  templateUrl: './handover-delete.component.html',
  styleUrls: ['./handover-delete.component.css']
})
export class HandoverDeleteComponent implements OnInit {

  showHandoverDelete?: boolean;
  idToDelete?: number;

  constructor(private handoverService: HandoverService,
              protected activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  /*** Usunięcie przekazania po ID ***/
  deleteHandoverById() {
    this.handoverService.deleteHandoverById(this.idToDelete).subscribe(handover => {
      console.log("Usunięto przekazanie o ID: " + this.idToDelete);
      this.refreshListAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania przekazania: " + error);
      window.alert("Nie można usunąć powiązanego przekazania");
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
