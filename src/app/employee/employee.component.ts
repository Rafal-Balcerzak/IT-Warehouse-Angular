import {Component, OnInit} from '@angular/core';
import {IEmployee} from "../models/employee";
import {EmployeeService} from "../services/employee.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EmployeeUpdateComponent} from "./employee-update/employee-update.component";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  allEmployees: Array<IEmployee> = []
  showEmployeeList: boolean = false;
  showEmployeeUpdate = true;

  constructor(private employeeService: EmployeeService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  openAddEmployee() {
    const modalRef = this.modalService.open(EmployeeUpdateComponent);
    modalRef.componentInstance.showEmployeeUpdate = this.showEmployeeUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  openEditEmployee(employeeToEdit: IEmployee) {
    const modalRef = this.modalService.open(EmployeeUpdateComponent);
    modalRef.componentInstance.showEmployeeUpdate = this.showEmployeeUpdate;
    modalRef.componentInstance.employeeToEdit = employeeToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }

  /*** Pobranie wszystkich pracowników ***/
  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(employee => {
      this.allEmployees = employee;
      this.showEmployeeList = true;
      console.log(employee);
    }, error => {
      console.log("Błąd pobierania pracowników " + error);
    })
  }

  /*** Usunięcie pracownika o danym ID ***/
  deleteEmployeeById(id: number) {
    this.employeeService.deleteEmployeeById(id).subscribe(employee => {
      console.log("Usunięto pracownika: " + employee);
      this.refreshList();
    }, error => {
      console.log("Błąd podczas usuwania pracownika: " + error);
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllEmployees() {
    this.allEmployees = [];
    this.showEmployeeList = false;
  }

  refreshList() {
    this.getAllEmployees();
  }

}
