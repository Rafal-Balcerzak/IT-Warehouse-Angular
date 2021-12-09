import {Component, OnInit} from '@angular/core';
import {IHandover} from "../models/handover";
import {HandoverService} from "../services/handover.service";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {HandoverUpdateComponent} from "./handover-update/handover-update.component";
import {formatDate} from "@angular/common";
import {Validators} from "@angular/forms";

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

  constructor(private handoverService: HandoverService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllHandovers();
  }

  openAddHandover() {
    const modalRef = this.modalService.open(HandoverUpdateComponent);
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  openEditHandover(handoverToEdit: IHandover) {
    const modalRef = this.modalService.open(HandoverUpdateComponent);
    modalRef.componentInstance.handoverToEdit = handoverToEdit;
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

  /*** Pobranie wszytskich przekazań ***/
  getAllHandovers() {
    this.handoverService.getAllHandovers().subscribe(handover => {
      this.allHandovers = handover;
      this.handoversToShow = handover;
      this.showHandoverList = true;
      console.log(handover)
    }, error => {
      console.log("Błąd podczas pobierania przekazań " + error);
    })
  }

  /*** Usunięcie przekazania po ID ***/
  deleteHandoverById(id: number) {
    this.handoverService.deleteHandoverById(id).subscribe(handover => {
      console.log("Usunięto przekazanie: " + handover);
      this.refreshList();
    }, error => {
      console.log("Błąd podczas usuwania przekazania: " + error);
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

}
