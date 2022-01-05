import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IEmployee} from "../models/employee";
import {EmployeeService} from "../services/employee.service";
import {NgbModal, NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";
import {EmployeeUpdateComponent} from "./employee-update/employee-update.component";
import {ICompany} from "../models/company";
import {CompanyUpdateComponent} from "../company/company-update/company-update.component";
import {CompanyDeleteComponent} from "../company/company-delete/company-delete.component";
import {EmployeeDeleteComponent} from "./employee-delete/employee-delete.component";

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
  @ViewChild('alert', { static: true }) alert: ElementRef;
  showDeleteNotification?: boolean;
  showAddNotification?: boolean;
  showEditNotification?: boolean;
  idEmployee?: number;

  constructor(private employeeService: EmployeeService,
              private modalService: NgbModal,
              config: NgbPaginationConfig) {
    config.boundaryLinks = true;
  }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  closeAlert() {
    this.showAddNotification = false;
    this.showEditNotification = false;
    this.showDeleteNotification = false;
  }

  openAddEmployee() {
    const modalRef = this.modalService.open(EmployeeUpdateComponent);
    modalRef.componentInstance.showEmployeeUpdate = this.showEmployeeUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
        this.closeAlert()
        this.showAddNotification = true;
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
        this.idEmployee = employeeToEdit.idEmployee;
        this.closeAlert();
        this.showEditNotification = true;
      }
    })
  }

  openDeleteEmployee(idToDelete: number){
    const modalRef = this.modalService.open(EmployeeDeleteComponent);
    modalRef.componentInstance.showEmployeeDelete = true;
    modalRef.componentInstance.idToDelete = idToDelete;
    modalRef.closed.subscribe(reason => {
      if (reason === 'delete') {
        this.refreshList();
        this.idEmployee = idToDelete;
        this.closeAlert()
        this.showDeleteNotification = true;
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
      window.alert("Nie można usunąć powiązanego pracownika");
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

  openCompanyDetails(companyToEdit: ICompany) {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = true;
    modalRef.componentInstance.showCompanyDetails = true;
    modalRef.componentInstance.companyToEdit = companyToEdit;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.refreshList();
      }
    })
  }
}
