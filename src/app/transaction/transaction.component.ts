import {Component, OnInit} from '@angular/core';
import {ITransaction} from "../models/transaction";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {TransactionService} from "../services/transaction.service";
import {TransactionUpdateComponent} from "./transaction-update/transaction-update.component";
import {formatDate} from "@angular/common";
import {Validators} from "@angular/forms";
import {IDemand} from "../models/demand";
import {DemandUpdateComponent} from "../demand/demand-update/demand-update.component";
import {IDistributor} from "../models/distributor";
import {DistributorUpdateComponent} from "../distributor/distributor-update/distributor-update.component";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  allTransactions: Array<ITransaction> = [];
  showTransactionList: boolean = false;
  showTransactionUpdate = true;
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  transactionsToShow: Array<ITransaction> = [];
  startSort: boolean = false;

  constructor(private transactionService: TransactionService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllTransactions();
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

  /*** Wyszukiwanie po wpisanej frazie ***/
  search(searchTerm: any) {
    if (searchTerm !== null || true || searchTerm !== '') {
      searchTerm = searchTerm.toLowerCase();
    }
    this.transactionsToShow = this.allTransactions.filter(transaction => {
      if (transaction.idTransaction.toString().toLowerCase().indexOf(searchTerm) !== -1
        || transaction.demand.idDemand.toString().toLowerCase().indexOf(searchTerm) !== -1
        || transaction.distributor.company.name.toLowerCase().indexOf(searchTerm) !== -1
        || [formatDate(transaction.transactionDate, 'dd.MM.yyyy', 'en'), [Validators.required]].toLocaleString().toLowerCase().indexOf(searchTerm) !== -1
        || transaction.price.toLowerCase().indexOf(searchTerm) !== -1
        || transaction.description.toLowerCase().indexOf(searchTerm) !== -1
        || (transaction.attachmentContentType !== null && transaction.attachmentContentType.substring(16).toLowerCase().indexOf(searchTerm) !== -1)
      )

        return transaction;
    })
  }

  /*** Pobranie wszystkich transakcji ***/
  getAllTransactions() {
    this.transactionService.getAllTransactions().subscribe(transaction => {
      this.allTransactions = transaction;
      this.transactionsToShow = transaction;
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

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.transactionsToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.transactionsToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }

    /*** Sortowanie po liczbach ***/
    if (colName.startsWith('idTransaction') || colName.startsWith('price')) {
      if (this.startSort == true) {
        this.transactionsToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.transactionsToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }

    /*** Sortowanie po zapotrzebowaniu ***/
    if (colName.startsWith('demand')) {
      let demandCol = colName.substring(7);
      if (this.startSort == true) {
        this.transactionsToShow.sort((a, b) => Number(a.demand[demandCol]) < Number(b.demand[demandCol]) ? 1 : Number(a.demand[demandCol]) > Number(b.demand[demandCol]) ? -1 : 0)
      } else {
        this.transactionsToShow.sort((a, b) => Number(a.demand[demandCol]) > Number(b.demand[demandCol]) ? 1 : Number(a.demand[demandCol]) < Number(b.demand[demandCol]) ? -1 : 0)
      }
    }

    /*** Sortowanie po firmie dostawcy ***/
    if (colName.startsWith('distributor.company')) {
      let distributorCompanyName = colName.substring(20);
      if (this.startSort == true) {
        this.transactionsToShow.sort((a, b) => a.distributor.company[distributorCompanyName] < b.distributor.company[distributorCompanyName] ? 1 : a.distributor.company[distributorCompanyName] > b.distributor.company[distributorCompanyName] ? -1 : 0)
      } else {
        this.transactionsToShow.sort((a, b) => a.distributor.company[distributorCompanyName] > b.distributor.company[distributorCompanyName] ? 1 : a.distributor.company[distributorCompanyName] < b.distributor.company[distributorCompanyName] ? -1 : 0)
      }
    }
    this.startSort = !this.startSort
  }

  openDemandDetails(demandToEdit: IDemand) {
    const modalRef = this.modalService.open(DemandUpdateComponent);
    modalRef.componentInstance.showDemandUpdate = true;
    modalRef.componentInstance.showDemandDetails = true;
    modalRef.componentInstance.demandToEdit = demandToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  openDistributorDetails(distributorToEdit: IDistributor) {
    const modalRef = this.modalService.open(DistributorUpdateComponent);
    modalRef.componentInstance.showDistributorUpdate = true;
    modalRef.componentInstance.showDistributorDetails = true;
    modalRef.componentInstance.distributorToEdit = distributorToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  downloadFile(id: number, name: string) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'http://localhost:8080/api/transaction/download/' + id);
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
