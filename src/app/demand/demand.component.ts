import { Component, OnInit } from '@angular/core';
import {IDemand} from "../models/demand";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DemandService} from "../services/demand.service";

@Component({
  selector: 'app-demand',
  templateUrl: './demand.component.html',
  styleUrls: ['./demand.component.css']
})
export class DemandComponent implements OnInit {

  allDemands: Array<IDemand> = [];
  showDemandsList: boolean = false;

  constructor(private demandService: DemandService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  /*** Pobranie wszytskich zapotrzebowań ***/
  getAllDemands(){
    this.demandService.getAllDemands().subscribe(demand =>{
      this.allDemands = demand;
      this.showDemandsList = true;
      console.log(demand);
    }, error => {
      console.log("Błąd pobierania zapotrzebowań " + error)
    })
  }

  /*** Doddanie nowego zapotrzebowania ***/
  addDemand(demand: IDemand){
    this.demandService.addDemand(demand).subscribe(demand => {
      console.log("Dodano nowe zapotrzebowanie: " + demand)
    }, error => {
      console.log("Błąd dodawania zapotrzebowania: " + demand);
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

  /*** Wyczyszczenie tablicy ***/
  clearAllDemands(){
    this.allDemands = [];
    this.showDemandsList = false;
  }

  refreshList(){
    this.getAllDemands();
  }
}
