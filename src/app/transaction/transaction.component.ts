import {Component, OnInit} from '@angular/core';
import {ITransaction} from "../models/transaction";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TransactionService} from "../services/transaction.service";
import {TransactionUpdateComponent} from "./transaction-update/transaction-update.component";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  allTransactions: Array<ITransaction> = [];
  showTransactionList: boolean = false;
  showTransactionUpdate: true;

  constructor(private transactionService: TransactionService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  openAddTransaction() {
    const modalRef = this.modalService.open(TransactionUpdateComponent);
    modalRef.componentInstance.showTransactionUpdate = this.showTransactionUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  openEditTransaction(transactionToEdit: ITransaction) {
    const modalRef = this.modalService.open(TransactionUpdateComponent);
    modalRef.componentInstance.showTransactionUpdate = this.showTransactionUpdate;
    modalRef.componentInstance.transactionToEdit = transactionToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  /*** Pobranie wszystkich transakcji ***/
  getAllTransactions() {
    this.transactionService.getAllTransactions().subscribe(transaction => {
      this.allTransactions = transaction;
      this.showTransactionList = true;
      console.log(transaction);
    }, error => {
      console.log("Błąd pobierania transakcji " + error);
    })
  }

  /*** Usunięcie transakcji po ID ***/
  deleteTransactionById(id: number) {
    this.transactionService.deleteTransactionById(id).subscribe(transaction => {
      console.log("usunięto transakcje: " + transaction);
      this.refreshList();
    }, error => {
      console.log("Błąd podczas usuwania transakcji " + error);
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllTransactions() {
    this.allTransactions = [];
    this.showTransactionList = false;
  }

  refreshList() {
    this.getAllTransactions();
  }

}
