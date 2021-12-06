import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AddressComponent} from './address/address.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal, NgbAlertModule, NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {CompanyComponent} from "./company/company.component";
import {HomeComponent} from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {MatSelectModule} from "@angular/material/select";
import {AddressUpdateComponent} from './address/address-update/address-update.component';
import {CompanyUpdateComponent} from './company/company-update/company-update.component';
import { DemandComponent } from './demand/demand.component';
import { DemandUpdateComponent } from './demand/demand-update/demand-update.component';
import { DistributorComponent } from './distributor/distributor.component';
import { DistributorUpdateComponent } from './distributor/distributor-update/distributor-update.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeUpdateComponent } from './employee/employee-update/employee-update.component';


@NgModule({
  declarations: [
    AppComponent,
    AddressComponent,
    CompanyComponent,
    HomeComponent,
    AddressUpdateComponent,
    CompanyUpdateComponent,
    DemandComponent,
    DemandUpdateComponent,
    DistributorComponent,
    DistributorUpdateComponent,
    EmployeeComponent,
    EmployeeUpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent],
  entryComponents: [
    AddressComponent,
    AddressUpdateComponent
  ]
})
export class AppModule {
}
