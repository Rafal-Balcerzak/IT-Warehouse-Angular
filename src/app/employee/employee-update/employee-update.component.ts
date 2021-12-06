import {Component, OnInit} from '@angular/core';
import {Employee, IEmployee} from "../../models/employee";
import {ICompany} from "../../models/company";
import {EmployeeService} from "../../services/employee.service";
import {CompanyService} from "../../services/company.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder} from "@angular/forms";
import {CompanyUpdateComponent} from "../../company/company-update/company-update.component";

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css']
})
export class EmployeeUpdateComponent implements OnInit {

  employeeToEdit?: IEmployee;
  allCompanies?: Array<ICompany> = [];
  showEmployeeUpdate?: boolean;
  showCompanyUpdate = true;

  editForm = this.fb.group({
    idEmployee: [],
    name: [],
    lastName: [],
    department: [],
    position: [],
    phoneNumber: [],
    email: [],
    company: []
  })

  constructor(private employeeService: EmployeeService,
              private companyService: CompanyService,
              protected activeModal: NgbActiveModal,
              private modalService: NgbModal,
              protected fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.employeeToEdit) {
      this.updateForm();
    }
    this.getAllCompanies();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  /*** Otwarcie komponentu do dodania firmy ***/
  openAddCompany() {
    const modalRef = this.modalService.open(CompanyUpdateComponent);
    modalRef.componentInstance.showCompanyUpdate = this.showCompanyUpdate;
    modalRef.closed.subscribe(reason => {
      if (reason === 'save') {
        this.getAllCompanies();
      }
    })
  }

  /*** Pobranie wszystkich firm ***/
  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe((company: Array<ICompany>) => {
      this.allCompanies = company;
      console.log(company);
    }, error => {
      console.log("Błąd pobierania firm " + error);
    })
  }

  /*** Zwraca nowego pracownika na bazie pól z formularza ***/
  protected createFromForm(): IEmployee {
    return {
      ...new Employee(),
      name: this.editForm.get('name')!.value,
      lastName: this.editForm.get('lastName')!.value,
      department: this.editForm.get('department')!.value,
      position: this.editForm.get('position')!.value,
      phoneNumber: this.editForm.get('phoneNumber')!.value,
      email: this.editForm.get('email')!.value,
      company: this.editForm.get('company')!.value
    }
  }

  /*** Uzupełnienie formularza jeśli ktoś edytuje ***/
  protected updateForm(): void {
    this.editForm.patchValue({
      name: this.employeeToEdit.name,
      lastName: this.employeeToEdit.lastName,
      department: this.employeeToEdit.department,
      position: this.employeeToEdit.position,
      phoneNumber: this.employeeToEdit.phoneNumber,
      email: this.employeeToEdit.email,
      company: this.employeeToEdit.company
    })
  }

  /*** Czyści formularz ***/
  protected clearForm(): void {
    this.editForm.patchValue({
      idEmployee: null,
      name: null,
      lastName: null,
      department: null,
      position: null,
      phoneNumber: null,
      email: null,
      company: null
    })
  }

  /*** Zapisuje lub edytuje pracownika, w zależności od tego czy pracownik do edycji zostal przekazany ***/
  save(): void {
    const employee = this.createFromForm();
    if (this.validateInput(employee)) {
      if (this.employeeToEdit === null || this.employeeToEdit === undefined) {
        this.employeeService.addEmployee(employee).subscribe(employee => {
          console.log("Dodano nowego pracownika: " + employee);
          this.refreshEmployeeList();
          this.cancel();
          this.clearForm();
        });
      } else {
        employee.idEmployee = this.employeeToEdit.idEmployee;
        this.employeeService.editEmployee(employee).subscribe(employee => {
          console.log("Edytowano pracownika: " + employee);
          this.refreshEmployeeList();
          this.cancel();
          this.clearForm();
        });
      }
    }
  }

  /*** Odświeża listę pracowników ***/
  refreshEmployeeList() {
    this.activeModal.close('save');
  }

  /*** Sprawdza czy wypełniane pola formularza nie są puste albo czy nie są spacjami itp ***/
  validateInput(employee: IEmployee): boolean {
    let employeeFieldsList = [];

    employeeFieldsList.push(employee.name);
    employeeFieldsList.push(employee.lastName);
    employeeFieldsList.push(employee.department);
    employeeFieldsList.push(employee.position);
    employeeFieldsList.push(employee.phoneNumber);
    employeeFieldsList.push(employee.email);

    for (let i = 0; i < employeeFieldsList.length; i++) {
      let value = employeeFieldsList[i];
      if (value === ''
        || value === null
        || value === undefined
        || value.trim().length === 0
        || employee.company === null
        || employee.company === undefined) {
        window.alert("Wypełnij wszystkie pola.");
        console.log(value)
        return false;
      }
    }
    return true;
  }

}
