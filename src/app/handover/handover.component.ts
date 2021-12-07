import {Component, OnInit} from '@angular/core';
import {IHandover} from "../models/handover";
import {HandoverService} from "../services/handover.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HandoverUpdateComponent} from "./handover-update/handover-update.component";

@Component({
  selector: 'app-handover',
  templateUrl: './handover.component.html',
  styleUrls: ['./handover.component.css']
})
export class HandoverComponent implements OnInit {

  allHandovers: Array<IHandover> = [];
  showHandoverList: boolean = false;

  constructor(private handoverService: HandoverService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
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

  /*** Pobranie wszytskich przekazań ***/
  getAllHandovers() {
    this.handoverService.getAllHandovers().subscribe(handover => {
      this.allHandovers = handover;
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
