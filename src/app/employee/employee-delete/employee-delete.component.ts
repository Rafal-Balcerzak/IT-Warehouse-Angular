import { Component, OnInit } from '@angular/core';
import {EmployeeService} from "../../services/employee.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-employee-delete',
  templateUrl: './employee-delete.component.html',
  styleUrls: ['./employee-delete.component.css']
})
export class EmployeeDeleteComponent implements OnInit {
  showEmployeeDelete?: boolean;
  idToDelete?: number;

  constructor(private employeeService: EmployeeService,
              protected activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  /*** Usunięcie pracownika o danym ID ***/
  deleteEmployeeById() {
    this.employeeService.deleteEmployeeById(this.idToDelete).subscribe(employee => {
      console.log("Usunięto pracownika o ID: " + this.idToDelete);
      this.refreshListAfterDelete();
    }, error => {
      console.log("Błąd podczas usuwania pracownika: " + error);
      window.alert("Nie można usunąć powiązanego pracownika");
    })
  }

  /*** Odswieża listę po usunięciu ***/
  refreshListAfterDelete() {
    this.activeModal.close('delete');
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

}
