import {Component, OnInit} from '@angular/core';
import {IEmployee} from "../models/employee";
import {EmployeeService} from "../services/employee.service";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
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
  page = 1;
  pageSize = 5;
  pageSizeList = [5, 10, 25, 50];
  employeesToShow: Array<IEmployee> = [];
  startSort: boolean = false;

  constructor(private employeeService: EmployeeService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllEmployees();
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

  /*** Wyszukiwanie po wpisanej frazie ***/
  search(searchTerm: any) {
    if (searchTerm !== null || true || searchTerm !== '') {
      searchTerm = searchTerm.toLowerCase();
    }
    this.employeesToShow = this.allEmployees.filter(employee => {
      if (employee.idEmployee.toString().toLowerCase().indexOf(searchTerm) !== -1
        || employee.name.toLowerCase().indexOf(searchTerm) !== -1
        || employee.lastName.toLowerCase().indexOf(searchTerm) !== -1
        || employee.department.toLowerCase().indexOf(searchTerm) !== -1
        || employee.position.toLowerCase().indexOf(searchTerm) !== -1
        || employee.phoneNumber.toLowerCase().indexOf(searchTerm) !== -1
        || employee.email.toLowerCase().indexOf(searchTerm) !== -1
        || employee.company.name.toLowerCase().indexOf(searchTerm) !== -1
      ) {
        return employee;
      }
    })
  }

  /*** Pobranie wszystkich pracowników ***/
  getAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(employee => {
      this.allEmployees = employee;
      this.employeesToShow = employee;
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

  /*** Sortowanie ***/
  sort(colName: string) {
    if (this.startSort == true) {
      this.employeesToShow.sort((a, b) => a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0)
    } else {
      this.employeesToShow.sort((a, b) => a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0)
    }

    /*** Sortowanie po liczbach ***/
    if(colName.startsWith('idEmployee')){
      if (this.startSort == true) {
        this.employeesToShow.sort((a, b) => Number(a[colName]) < Number(b[colName]) ? 1 : Number(a[colName]) > Number(b[colName]) ? -1 : 0)
      } else {
        this.employeesToShow.sort((a, b) => Number(a[colName]) > Number(b[colName]) ? 1 : Number(a[colName]) < Number(b[colName]) ? -1 : 0)
      }
    }

    /*** Sortowanie po firmie ***/
    if(colName.startsWith('company')){
      let companyName = colName.substring(8);
      if(this.startSort == true){
        this.employeesToShow.sort((a, b) => a.company[companyName] < b.company[companyName] ? 1 : a.company[companyName] > b.company[companyName] ? -1 : 0)
      }else {
        this.employeesToShow.sort((a, b) => a.company[companyName] > b.company[companyName] ? 1 : a.company[companyName] < b.company[companyName] ? -1 : 0)
      }
    }
    this.startSort = !this.startSort
  }
}
