import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IHandover} from "../models/handover";
import {HandoverService} from "../services/handover.service";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {HandoverUpdateComponent} from "./handover-update/handover-update.component";
import {formatDate} from "@angular/common";
import {Validators} from "@angular/forms";
import {ICompany} from "../models/company";
import {CompanyUpdateComponent} from "../company/company-update/company-update.component";
import {IEmployee} from "../models/employee";
import {EmployeeUpdateComponent} from "../employee/employee-update/employee-update.component";
import {DemandDeleteComponent} from "../demand/demand-delete/demand-delete.component";
import {HandoverDeleteComponent} from "./handover-delete/handover-delete.component";

@Component({
  selector: 'app-handover',
  templateUrl: './handover.component.html',
  styleUrls: ['./handover.component.css']
})
export class HandoverComponent implements OnInit {

  allHandovers: Array<IHandover> = [];
  showHandoverList: boolean = false;
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  handoversToShow: Array<IHandover> = [];
  startSort: boolean = false;
  @ViewChild('alert', { static: true }) alert: ElementRef;
  showDeleteNotification?: boolean;
  showAddNotification?: boolean;
  showEditNotification?: boolean;
  idHandover?: number;

  constructor(private handoverService: HandoverService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllHandovers();
  }

  closeAlert() {
    this.showAddNotification = false;
    this.showEditNotification = false;
    this.showDeleteNotification = false;
  }

  openAddHandover() {
    const modalRef = this.modalService.open(HandoverUpdateComponent);
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.closeAlert()
        this.showAddNotification = true;
      }
    })
  }

  openDeleteHandover(idToDelete: number){
    const modalRef = this.modalService.open(HandoverDeleteComponent);
    modalRef.componentInstance.showHandoverDelete = true;
    modalRef.componentInstance.idToDelete = idToDelete;
    modalRef.closed.subscribe(reason => {
      if (reason === 'delete') {
        this.refreshList();
        this.idHandover = idToDelete;
        this.closeAlert();
        this.showDeleteNotification = true;
      }
    })
  }

  openEditHandover(handoverToEdit: IHandover) {
    const modalRef = this.modalService.open(HandoverUpdateComponent);
    modalRef.componentInstance.handoverToEdit = handoverToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.idHandover = handoverToEdit.idHandover;
        this.closeAlert();
        this.showEditNotification = true;
      }
    })
  }

  /*** Wyszukiwanie po wpisanej frazie ***/
  search(searchTerm: any) {
    if (searchTerm !== null || true || searchTerm !== '') {
      searchTerm = searchTerm.toLowerCase();
    }
    this.handoversToShow = this.allHandovers.filter(handover => {
      if (handover.idHandover.toString().toLowerCase().indexOf(searchTerm) !== -1
        || handover.product.productType.toLowerCase().indexOf(searchTerm) !== -1
        || handover.product.model.toLowerCase().indexOf(searchTerm) !== -1
        || handover.product.inventoryNumber.toLowerCase().indexOf(searchTerm) !== -1
        || [formatDate(handover.handoverDate, 'dd.MM.yyyy', 'en'), [Validators.required]].toLocaleString().toLowerCase().indexOf(searchTerm) !== -1
        || handover.employee.name.toLowerCase().indexOf(searchTerm) !== -1
        || handover.employee.company.name.toLowerCase().indexOf(searchTerm) !== -1
        || handover.employee.lastName.toString().toLowerCase().indexOf(searchTerm) !== -1
      ) {
        return handover;
      }
    })
  }

  /*** Pobranie wszytskich przekaza?? ***/
  getAllHandovers() {
    this.handoverService.getAllHandovers().subscribe(handover => {
      this.allHandovers = handover;
      this.handoversToShow = handover;
      this.showHandoverList = true;
      console.log(handover)
    }, error => {
      console.log("B????d podczas pobierania przekaza?? " + error);
    })
  }

  /*** Usuni??cie przekazania po ID ***/
  deleteHandoverById(id: number) {
    this.handoverService.deleteHandoverById(id).subscribe(handover => {
      console.log("Usuni??to przekazanie: " + handover);
      this.refreshList();
    }, error => {
      console.log("B????d podczas usuwania przekazania: " + error);
      window.alert("Nie mo??na usun???? powi??zanego przekazania");
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllHandovers() {
    this.allHandovers = [];
    this.showHandoverList = false;
  }

  refreshList() {
    this.getAllHandovers()
  }

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.handoversToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.handoversToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }

    /*** Sortowanie po liczbach ***/
    if(colName.startsWith('idHandover')){
      if (this.startSort == true) {
        this.handoversToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.handoversToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }

    /*** Sortowanie po produkcie ***/
    if(colName.startsWith('product')){
      let productCol = colName.substring(8);
      if(this.startSort == true){
        this.handoversToShow.sort((a, b) => a.product[productCol] < b.product[productCol] ? 1 : a.product[productCol] > b.product[productCol] ? -1 : 0)
      }else {
        this.handoversToShow.sort((a, b) => a.product[productCol] > b.product[productCol] ? 1 : a.product[productCol] < b.product[productCol] ? -1 : 0)
      }
    }

    /*** Sortowanie po pracowniku ***/
    if(colName.startsWith('employee')){
      let employeeCol = colName.substring(9);
      if(this.startSort == true){
        this.handoversToShow.sort((a, b) => a.employee[employeeCol] < b.employee[employeeCol] ? 1 : a.employee[employeeCol] > b.employee[employeeCol] ? -1 : 0)
      }else {
        this.handoversToShow.sort((a, b) => a.employee[employeeCol] > b.employee[employeeCol] ? 1 : a.employee[employeeCol] < b.employee[employeeCol] ? -1 : 0)
      }
    }

    /*** Sortowanie po firmie pracowniku ***/
    if(colName.startsWith('employee.company')){
      let employeeCompanyName = colName.substring(17);
      if(this.startSort == true){
        this.handoversToShow.sort((a, b) => a.employee.company[employeeCompanyName] < b.employee.company[employeeCompanyName] ? 1 : a.employee.company[employeeCompanyName] > b.employee.company[employeeCompanyName] ? -1 : 0)
      }else {
        this.handoversToShow.sort((a, b) => a.employee.company[employeeCompanyName] > b.employee.company[employeeCompanyName] ? 1 : a.employee.company[employeeCompanyName] < b.employee.company[employeeCompanyName] ? -1 : 0)
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

  openEmployeeDetails(employeeToEdit: IEmployee) {
    const modalRef = this.modalService.open(EmployeeUpdateComponent);
    modalRef.componentInstance.showEmployeeUpdate = true;
    modalRef.componentInstance.showEmployeeDetails = true;
    modalRef.componentInstance.employeeToEdit = employeeToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }
}
