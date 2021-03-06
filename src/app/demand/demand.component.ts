import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {IDemand} from "../models/demand";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {DemandService} from "../services/demand.service";
import {DemandUpdateComponent} from "./demand-update/demand-update.component";
import {formatDate} from "@angular/common";
import {Validators} from "@angular/forms";
import {ICompany} from "../models/company";
import {CompanyUpdateComponent} from "../company/company-update/company-update.component";
import {DemandDeleteComponent} from "./demand-delete/demand-delete.component";

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrls: ['./demand.component.css']
})
export class DemandComponent implements OnInit {

  allDemands: Array<IDemand> = [];
  showDemandsList: boolean = false;
  showDemandUpdate = true;
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  demandsToShow: Array<IDemand> = [];
  startSort: boolean = false;
  notDoneDemandsCount?: number;
  @ViewChild('alert', { static: true }) alert: ElementRef;
  showDeleteNotification?: boolean;
  showAddNotification?: boolean;
  showEditNotification?: boolean;
  idDemand?: number;

  constructor(private demandService: DemandService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllDemands();
  }

  closeAlert() {
    this.showAddNotification = false;
    this.showEditNotification = false;
    this.showDeleteNotification = false;
  }

  openAddDemand() {
    const modalRef = this.modalService.open(DemandUpdateComponent);
    modalRef.componentInstance.showDemandUpdate = this.showDemandUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.closeAlert()
        this.showAddNotification = true;
      }
    })
  }

  openDeleteDemand(idToDelete: number){
    const modalRef = this.modalService.open(DemandDeleteComponent);
    modalRef.componentInstance.showDemandDelete = true;
    modalRef.componentInstance.idToDelete = idToDelete;
    modalRef.closed.subscribe(reason => {
      if (reason === 'delete') {
        this.refreshList();
        this.idDemand = idToDelete;
        this.closeAlert();
        this.showDeleteNotification = true;
      }
    })
  }

  /*** Wyszukiwanie po wpisanej frazie ***/
  search(searchTerm: any) {
    if (searchTerm !== null || true || searchTerm !== '') {
      searchTerm = searchTerm.toLowerCase();
    }
    this.demandsToShow = this.allDemands.filter(demand => {
      if (demand.idDemand.toString().toLowerCase().indexOf(searchTerm) !== -1
        || demand.productType.toLowerCase().indexOf(searchTerm) !== -1
        || demand.model.toLowerCase().indexOf(searchTerm) !== -1
        || [formatDate(demand.issueDate, 'dd.MM.yyyy', 'en'), [Validators.required]].toLocaleString().toLowerCase().indexOf(searchTerm) !== -1
        || demand.budget.toLowerCase().indexOf(searchTerm) !== -1
        || demand.quantity.toString().toLowerCase().indexOf(searchTerm) !== -1
        || demand.company.name.toLowerCase().indexOf(searchTerm) !== -1
        || demand.done.toString().toLowerCase().indexOf(searchTerm) !== -1) {
        return demand;
      }
    })
  }

  /*** Pobranie wszytskich zapotrzebowa?? ***/
  getAllDemands() {
    this.demandService.getAllDemands().subscribe(demand => {
      this.allDemands = demand;
      this.demandsToShow = demand;
      this.showDemandsList = true;
      console.log(demand);
    }, error => {
      console.log("B????d pobierania zapotrzebowa?? " + error)
    })
  }

  /*** Usuni??cie zapotrzebowania po ID ***/
  deleteDemandById(id: number) {
    this.demandService.deleteDemandById(id).subscribe(demand => {
      console.log("Usuni??to zapotrzebowanie: " + demand);
      this.refreshList();
    }, error => {
      console.log("B????d podczas usuwania zapotrzebowania: " + error);
      window.alert("Nie mo??na usun???? powi??zanego zapotrzebowania");
    })
  }

  openEditDemand(demandToEdit: IDemand) {
    const modalRef = this.modalService.open(DemandUpdateComponent);
    modalRef.componentInstance.showDemandUpdate = this.showDemandUpdate;
    modalRef.componentInstance.demandToEdit = demandToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.idDemand = demandToEdit.idDemand;
        this.closeAlert();
        this.showEditNotification = true;
      }
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllDemands() {
    this.allDemands = [];
    this.showDemandsList = false;
  }

  refreshList() {
    this.getAllDemands();
    this.getNotDoneDemandsCount();
  }

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.demandsToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.demandsToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }

    /*** Sortowanie po liczbach ***/
    if (colName.startsWith('idDemand') || colName.startsWith('budget') || colName.startsWith('quantity')) {
      if (this.startSort == true) {
        this.demandsToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.demandsToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }

    /*** Sortowanie po firmie ***/
    if (colName.startsWith('company')) {
      let companyName = colName.substring(8);
      if (this.startSort == true) {
        this.demandsToShow.sort((a, b) => a.company[companyName] < b.company[companyName] ? 1 : a.company[companyName] > b.company[companyName] ? -1 : 0)
      } else {
        this.demandsToShow.sort((a, b) => a.company[companyName] > b.company[companyName] ? 1 : a.company[companyName] < b.company[companyName] ? -1 : 0)
      }
    }
    this.startSort = !this.startSort
  }

  openCompanyDetails(companyToEdit: ICompany) {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = true;
    modalRef.componentInstance.showCompanyDetails = true;
    modalRef.componentInstance.companyToEdit = companyToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  getNotDoneDemandsCount() {
    this.demandService.countByIsDoneFalse().subscribe(count => {
      this.notDoneDemandsCount = count;
    })
  }
}
