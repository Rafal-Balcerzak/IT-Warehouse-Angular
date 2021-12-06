import {Component, OnInit} from '@angular/core';
import {IEmployee} from "../models/employee";
import {EmployeeService} from "../services/employee.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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

  //TODO dodać metody do otwierania okna edycji i dodawania nowych pracowników


  /*** Pobranie wszystkich pracowników ***/
  getAllEmployees(){
    this.employeeService.getAllEmployees().subscribe(employee =>{
      this.allEmployees = employee;
      this.showEmployeeList = true;
      console.log(employee);
    }, error =>{
      console.log("Błąd pobierania pracowników " + error);
    })
  }

  /*** Usunięcie pracownika o danym ID ***/
  deleteEmployeeById(id: number){
    this.employeeService.deleteEmployeeById(id).subscribe(employee =>{
      console.log("Usunięto pracownika: " + employee);
      this.refreshList();
    }, error => {
      console.log("Błąd podczas usuwania pracownika: " + error);
    })
  }

  /*** Wyczyszczenie tablicy ***/
  clearAllEmployees(){
    this.allEmployees = [];
    this.showEmployeeList = false;
  }

  refreshList(){
    this.getAllEmployees();
  }

}
