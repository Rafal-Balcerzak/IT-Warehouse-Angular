import {Component, OnInit} from '@angular/core';
import {DemandService} from "../../services/demand.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-demand-delete',
  templateUrl: './demand-delete.component.html',
  styleUrls: ['./demand-delete.component.css']
})
export class DemandDeleteComponent implements OnInit {
  showDemandDelete?: boolean;
  idToDelete?: number;

  constructor(private demandService: DemandService,
              protected activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  /*** Usunięcie zapotrzebowania po ID ***/
  deleteDemandById() {
    this.demandService.deleteDemandById(this.idToDelete).subscribe(demand => {
      console.log("Usunięto zapotrzebowanie o ID: " + this.idToDelete);
      this.refreshListAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania zapotrzebowania: " + error);
      window.alert("Nie można usunąć powiązanego zapotrzebowania");
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
