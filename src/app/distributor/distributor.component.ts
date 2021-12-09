import {Component, OnInit} from '@angular/core';
import {IDistributor} from "../models/distributor";
import {DistributorService} from "../services/distributor.service";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {DistributorUpdateComponent} from "./distributor-update/distributor-update.component";

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

  constructor(private distributorService: DistributorService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllDistributors();
  }

  openAddDistributor() {
    const modalRef = this.modalService.open(DistributorUpdateComponent);
    modalRef.componentInstance.showDistributorUpdate = this.showDistributorUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
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

  /*** Pobranie wszystkich dostawców ***/
  getAllDistributors() {
    this.distributorService.getAllDistributors().subscribe(distributor => {
      this.allDistributors = distributor;
      this.distributorsToShow = distributor;
      this.showDistributorList = true;
      console.log(distributor);
    }, error => {
      console.log("Błąd pobierania dostawców " + error);
    })
  }

  /*** Usunięcie dostawcy po ID ***/
  deleteDistributorById(id: number) {
    this.distributorService.deleteDistributorById(id).subscribe(distributor => {
      console.log("Usunięto dostawcę: " + distributor);
      this.refreshList();
    }, error => {
      console.log("Błąd podczas usuwania dostawcy: " + error);
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
}
