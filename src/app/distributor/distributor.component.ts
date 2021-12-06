import { Component, OnInit } from '@angular/core';
import {Distributor, IDistributor} from "../models/distributor";
import {DistributorService} from "../services/distributor.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.css']
})
export class DistributorComponent implements OnInit {

  allDistributors: Array<IDistributor> = [];
  showDistributorList: boolean = false;

  constructor(private distributorService: DistributorService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  /*** Pobranie wszystkich dostawców ***/
  getAllDistributors(){
    this.distributorService.getAllDistributors().subscribe(distributor =>{
      this.allDistributors = distributor;
      this.showDistributorList = true;
      console.log(distributor);
    }, error => {
      console.log("Błąd pobierania dostawców " + error);
    })
  }



}
