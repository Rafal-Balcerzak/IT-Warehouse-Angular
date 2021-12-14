import {Component, OnInit} from '@angular/core';
import {ITransaction, Transaction} from "../../models/transaction";
import {IDemand} from "../../models/demand";
import {IDistributor} from "../../models/distributor";
import {TransactionService} from "../../services/transaction.service";
import {DemandService} from "../../services/demand.service";
import {DistributorService} from "../../services/distributor.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {DemandUpdateComponent} from "../../demand/demand-update/demand-update.component";
import {DistributorUpdateComponent} from "../../distributor/distributor-update/distributor-update.component";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-transaction-update',
  templateUrl: './transaction-update.component.html',
  styleUrls: ['./transaction-update.component.css']
})
export class TransactionUpdateComponent implements OnInit {

  transactionToEdit?: ITransaction;
  allDemands?: Array<IDemand> = [];
  showTransactionUpdate?: boolean;
  allDistributors?: Array<IDistributor> = [];
  showDemandUpdate = true;
  showDistributorUpdate = true;
  showTransactionDetails = false;
  fileUrl;

  editForm = this.fb.group({
    idTransaction: [],
    demand: [],
    distributor: [],
    transactionDate: [],
    price: [],
    description: [],
    attachment: [],
    attachmentContentType: []
  })

  constructor(private transactionService: TransactionService,
              private demandService: DemandService,
              private distributorService: DistributorService,
              protected activeModal: NgbActiveModal,
              private modalService: NgbModal,
              protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.transactionToEdit) {
      this.updateForm();
    }
    this.getAllDemands();
    this.getAllDistributors();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  /*** Otwarcie komponentu do dodawania zapotrzebowania ***/
  openAddDemand() {
    const modalRef = this.modalService.open(DemandUpdateComponent);
    modalRef.componentInstance.showDemandUpdate = this.showDemandUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.getAllDemands();
      }
    })
  }

  /*** Otwarcie komponentu do dodawania dostawcy ***/
  openAddDistributor() {
    const modalRef = this.modalService.open(DistributorUpdateComponent);
    modalRef.componentInstance.showDistributorUpdate = this.showDistributorUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.getAllDistributors();
      }
    })
  }

  /*** Zwraca nową transakcje na bazie pól z formularza ***/
  protected createFromForm(): ITransaction {
    return {
      ...new Transaction(),
      demand: this.editForm.get('demand')!.value,
      distributor: this.editForm.get('distributor')!.value,
      transactionDate: this.editForm.get('transactionDate')!.value,
      price: this.editForm.get('price')!.value,
      description: this.editForm.get('description')!.value,
      attachmentContentType: this.editForm.get('attachmentContentType')!.value,
      attachment: this.editForm.get('attachment')!.value
    }
  }

  /*** Uzupełnienie formularza jeśli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm = this.fb.group({
      idTransaction: this.transactionToEdit.idTransaction,
      demand: this.transactionToEdit.demand,
      distributor: this.transactionToEdit.distributor,
      transactionDate: [formatDate(this.transactionToEdit.transactionDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      price: this.transactionToEdit.price,
      description: this.transactionToEdit.description,
      attachmentContentType: this.transactionToEdit.attachmentContentType,
      attachment: this.transactionToEdit.attachment
    })
  }

  /*** Czyści formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      idTransaction: null,
      demand: null,
      distributor: null,
      transactionDate: null,
      price: null,
      description: null,
      attachmentContentType: null,
      attachment: null
    })
  }

  /*** Zapisauje lub edytuje transakcje, w zależności od tego czy transakcja do edycji została przekazana ***/
  save(): void {
    const transaction = this.createFromForm();
    console.log(transaction);
    if (this.validateInput(transaction)) {
      if (this.transactionToEdit === null || this.transactionToEdit === undefined) {
        this.transactionService.addTransaction(transaction).subscribe(transaction => {
          console.log("Dodano nową transakcje: " + transaction.attachment);
          this.refreshListTransaction();
          this.cancel();
          this.clearForm();
        });
      } else {
        transaction.idTransaction = this.transactionToEdit.idTransaction;
        this.transactionService.editTransaction(transaction).subscribe(transaction => {
          console.log("Edytowano transakcje: " + transaction.description);
          this.refreshListTransaction();
          this.cancel();
          this.clearForm();
        });
      }
    }
  }

  /*** Pobranie wszytskich zapotrzebowań ***/
  getAllDemands() {
    this.demandService.getAllDemands().subscribe(demand => {
      this.allDemands = demand;
      console.log(demand);
    }, error => {
      console.log("Błąd pobierania zapotrzebowań " + error)
    })
  }

  /*** Pobranie wszystkich dostawców ***/
  getAllDistributors() {
    this.distributorService.getAllDistributors().subscribe(distributor => {
      this.allDistributors = distributor;
      console.log(distributor);
    }, error => {
      console.log("Błąd pobierania dostawców " + error);
    })
  }

  /*** Odświeżenie listy transakcji ***/
  refreshListTransaction() {
    this.activeModal.close('save');
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(transaction: ITransaction): boolean {
    let transactionFieldsList = [];

    transactionFieldsList.push(transaction.price);
    transactionFieldsList.push(transaction.description);

    for (let i = 0; i < transactionFieldsList.length; i++) {
      let value = transactionFieldsList[i];
      if (value === ''
        || value === null
        || value === undefined
        || value.trim().length === 0
        || transaction.demand === null
        || transaction.demand === undefined
        || transaction.distributor === null
        || transaction.distributor === undefined
        || transaction.transactionDate === null
        || transaction.transactionDate === undefined
        || transaction.transactionDate.toLocaleString().trim().length < 10) {
        window.alert("Wypełnij wszystkie pola.");
        console.log(value)
        return false;
      }
    }
    return true;
  }

  /*** Przekazanie pliku ***/
  handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file.type.match('application/pdf')) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Header: string = (reader.result.toString().substring(5, 20));
        const base64Data: string = (reader.result.toString().substring(28));
        console.log("Typ: " + base64Header + ',' + file.name);
        console.log("Data: " + base64Data);
        console.log("Nazwa pliku: " + file.name)
        this.editForm.patchValue({
          ['attachment']: base64Data,
          ['attachmentContentType']: base64Header + ',' + file.name
        })
      }
    } else {
      window.alert("Można przesyłać jedynie pliki PDF, ten plik nie zostanie zapisany!");
      return false;
    }
    this.deleteAttachment();
  }


  /*** Poranie pliku ***/
  downloadFile(id: number, name: string) {
    if (this.transactionToEdit.attachment !== null && this.transactionToEdit.attachmentContentType === this.editForm.get('attachmentContentType')!.value) {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'http://localhost:8080/api/transaction/download/' + id);
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      window.alert("Zapisz, aby pobrać nowy załącznik")
      console.log("Nie zapisano jeszcze załącznika dla tej transakcji")
    }
  }


  /*** wyczyszczenie danych o pliku ***/
  deleteAttachment() {
    if (this.editForm.get('attachmentContentType')!.value) {
      this.transactionToEdit.attachmentContentType = null;
      this.transactionToEdit.attachment = null;
      this.editForm.patchValue({
        attachmentContentType: null,
        attachment: null
      })
    }
  }
}
