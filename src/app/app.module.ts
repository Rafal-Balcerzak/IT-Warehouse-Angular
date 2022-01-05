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
import {DemandComponent} from './demand/demand.component';
import {DemandUpdateComponent} from './demand/demand-update/demand-update.component';
import {DistributorComponent} from './distributor/distributor.component';
import {DistributorUpdateComponent} from './distributor/distributor-update/distributor-update.component';
import {EmployeeComponent} from './employee/employee.component';
import {EmployeeUpdateComponent} from './employee/employee-update/employee-update.component';
import {TransactionComponent} from './transaction/transaction.component';
import {TransactionUpdateComponent} from './transaction/transaction-update/transaction-update.component';
import { ProductComponent } from './product/product.component';
import { ProductUpdateComponent } from './product/product-update/product-update.component';
import { HandoverComponent } from './handover/handover.component';
import { HandoverUpdateComponent } from './handover/handover-update/handover-update.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import {MatBadgeModule} from "@angular/material/badge";
import { AddressDeleteComponent } from './address/address-delete/address-delete.component';
import { CompanyDeleteComponent } from './company/company-delete/company-delete.component';
import { DemandDeleteComponent } from './demand/demand-delete/demand-delete.component';
import { DistributorDeleteComponent } from './distributor/distributor-delete/distributor-delete.component';
import { EmployeeDeleteComponent } from './employee/employee-delete/employee-delete.component';
import { HandoverDeleteComponent } from './handover/handover-delete/handover-delete.component';
import { ProductDeleteComponent } from './product/product-delete/product-delete.component';
import { TransactionDeleteComponent } from './transaction/transaction-delete/transaction-delete.component';


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
    EmployeeUpdateComponent,
    TransactionComponent,
    TransactionUpdateComponent,
    ProductComponent,
    ProductUpdateComponent,
    HandoverComponent,
    HandoverUpdateComponent,
    NavbarComponent,
    AddressDeleteComponent,
    CompanyDeleteComponent,
    DemandDeleteComponent,
    DistributorDeleteComponent,
    EmployeeDeleteComponent,
    HandoverDeleteComponent,
    ProductDeleteComponent,
    TransactionDeleteComponent
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
        ReactiveFormsModule,
        MatBadgeModule
    ],
  providers: [NgbActiveModal, NavbarComponent],
  bootstrap: [AppComponent],
  entryComponents: [
    AddressComponent,
    AddressUpdateComponent
  ]
})
export class AppModule {
}
