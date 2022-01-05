import { Component, OnInit } from '@angular/core';
import {TransactionService} from "../../services/transaction.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-transaction-delete',
  templateUrl: './transaction-delete.component.html',
  styleUrls: ['./transaction-delete.component.css']
})
export class TransactionDeleteComponent implements OnInit {

  showTransactionDelete?: boolean;
  idToDelete?: number;

  constructor(private transactionService: TransactionService,
              protected activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  /*** Usunięcie transakcji po ID ***/
  deleteTransactionById() {
    this.transactionService.deleteTransactionById(this.idToDelete).subscribe(transaction => {
      console.log("usunięto transakcje o ID: " + this.idToDelete);
      this.refreshListAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania transakcji " + error);
      window.alert("Nie można usunąć powiązanej transakcji");
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
