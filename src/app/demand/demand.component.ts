import { Component, OnInit } from '@angular/core';
import {IDemand} from "../models/demand";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {DemandService} from "../services/demand.service";
import {DemandUpdateComponent} from "./demand-update/demand-update.component";
import {formatDate} from "@angular/common";
import {Validators} from "@angular/forms";

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

  constructor(private demandService: DemandService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllDemands();
  }

  openAddDemand(){
    const modalRef = this.modalService.open(DemandUpdateComponent);
    modalRef.componentInstance.showDemandUpdate = this.showDemandUpdate;
    modalRef.closed.subscribe( reason =>{
      if(reason === 'save'){
        this.refreshList();
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
        || [formatDate(demand.issueDate, 'dd.MM.yyyy', 'en'),[Validators.required]].toLocaleString().toLowerCase().indexOf(searchTerm) !== -1
        || demand.budget.toLowerCase().indexOf(searchTerm) !== -1
        || demand.quantity.toString().toLowerCase().indexOf(searchTerm) !== -1
        || demand.company.name.toLowerCase().indexOf(searchTerm) !== -1) {
        return demand;
      }
    })
  }

  /*** Pobranie wszytskich zapotrzebowań ***/
  getAllDemands(){
    this.demandService.getAllDemands().subscribe(demand =>{
      this.allDemands = demand;
      this.demandsToShow = demand;
      this.showDemandsList = true;
      console.log(demand);
    }, error => {
      console.log("Błąd pobierania zapotrzebowań " + error)
    })
  }

  /*** Usunięcie zapotrzebowania po ID ***/
  deleteDemandById(id: number){
    this.demandService.deleteDemandById(id).subscribe(demand => {
      console.log("Usunięto zapotrzebowanie: " + demand);
      this.refreshList();
    }, error =>{
      console.log("Błąd podczas usuwania zapotrzebowania: " + error);
    })
  }

  openEditDemand(demandToEdit: IDemand){
    const modalRef = this.modalService.open(DemandUpdateComponent);
    modalRef.componentInstance.showDemandUpdate = this.showDemandUpdate;
    modalRef.componentInstance.demandToEdit = demandToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllDemands(){
    this.allDemands = [];
    this.showDemandsList = false;
  }

  refreshList(){
    this.getAllDemands();
  }
}
