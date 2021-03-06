import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IDistributor} from "../models/distributor";
import {DistributorService} from "../services/distributor.service";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {DistributorUpdateComponent} from "./distributor-update/distributor-update.component";
import {ICompany} from "../models/company";
import {CompanyUpdateComponent} from "../company/company-update/company-update.component";
import {DistributorDeleteComponent} from "./distributor-delete/distributor-delete.component";

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.css']
})
export class DistributorComponent implements OnInit {

  allDistributors: Array<IDistributor> = [];
  showDistributorList: boolean = false;
  showDistributorUpdate = true;
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  distributorsToShow: Array<IDistributor> = [];
  startSort: boolean = false;
  @ViewChild('alert', { static: true }) alert: ElementRef;
  showDeleteNotification?: boolean;
  showAddNotification?: boolean;
  showEditNotification?: boolean;
  idDistributor?: number;

  constructor(private distributorService: DistributorService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllDistributors();
  }

  closeAlert() {
    this.showAddNotification = false;
    this.showEditNotification = false;
    this.showDeleteNotification = false;
  }

  openAddDistributor() {
    const modalRef = this.modalService.open(DistributorUpdateComponent);
    modalRef.componentInstance.showDistributorUpdate = this.showDistributorUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.closeAlert()
        this.showAddNotification = true;
      }
    })
  }

  openEditDistributor(distributorToEdit: IDistributor) {
    const modalRef = this.modalService.open(DistributorUpdateComponent);
    modalRef.componentInstance.showDistributorUpdate = this.showDistributorUpdate;
    modalRef.componentInstance.distributorToEdit = distributorToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.idDistributor = distributorToEdit.idDistributor;
        this.closeAlert();
        this.showEditNotification = true;
      }
    })
  }

  openDistributorDelete(idToDelete: number){
    const modalRef = this.modalService.open(DistributorDeleteComponent);
    modalRef.componentInstance.showDistributorDelete = true;
    modalRef.componentInstance.idToDelete = idToDelete;
    modalRef.closed.subscribe(reason => {
      if (reason === 'delete') {
        this.refreshList();
        this.idDistributor = idToDelete;
        this.closeAlert()
        this.showDeleteNotification = true;
      }
    })
  }

  /*** Wyszukiwanie po wpisanej frazie ***/
  search(searchTerm: any) {
    if (searchTerm !== null || true || searchTerm !== '') {
      searchTerm = searchTerm.toLowerCase();
    }
    this.distributorsToShow = this.allDistributors.filter(distributor => {
      if (distributor.idDistributor.toString().toLowerCase().indexOf(searchTerm) !== -1
        || distributor.company.name.toLowerCase().indexOf(searchTerm) !== -1
        || distributor.phoneNumber.toLowerCase().indexOf(searchTerm) !== -1
        || distributor.email.toLowerCase().indexOf(searchTerm) !== -1) {
        return distributor;
      }
    })
  }

  /*** Pobranie wszystkich dostawc??w ***/
  getAllDistributors() {
    this.distributorService.getAllDistributors().subscribe(distributor => {
      this.allDistributors = distributor;
      this.distributorsToShow = distributor;
      this.showDistributorList = true;
      console.log(distributor);
    }, error => {
      console.log("B????d pobierania dostawc??w " + error);
    })
  }

  /*** Usuni??cie dostawcy po ID ***/
  deleteDistributorById(id: number) {
    this.distributorService.deleteDistributorById(id).subscribe(distributor => {
      console.log("Usuni??to dostawc??: " + distributor);
      this.refreshList();
    }, error => {
      console.log("B????d podczas usuwania dostawcy: " + error);
      window.alert("Nie mo??na usun???? powi??zanego dostawcy");
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllDistributors() {
    this.allDistributors = [];
    this.showDistributorList = false;
  }

  refreshList() {
    this.getAllDistributors();
  }

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.distributorsToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.distributorsToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }

    /*** Sortowanie po liczbach ***/
    if(colName.startsWith('idDistributor')){
      if (this.startSort == true) {
        this.distributorsToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.distributorsToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }

    /*** Sortowanie po firmie ***/
    if(colName.startsWith('company')){
      let companyName = colName.substring(8);
      if(this.startSort == true){
        this.distributorsToShow.sort((a, b) => a.company[companyName] < b.company[companyName] ? 1 : a.company[companyName] > b.company[companyName] ? -1 : 0)
      }else {
        this.distributorsToShow.sort((a, b) => a.company[companyName] > b.company[companyName] ? 1 : a.company[companyName] < b.company[companyName] ? -1 : 0)
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
}
