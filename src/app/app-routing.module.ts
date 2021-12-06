import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddressComponent} from "./address/address.component";
import {CompanyComponent} from "./company/company.component";
import {HomeComponent} from "./home/home.component";
import {DemandComponent} from "./demand/demand.component";
import {DistributorComponent} from "./distributor/distributor.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'address', component: AddressComponent},
  {path: 'company', component: CompanyComponent},
  {path: 'demand', component: DemandComponent},
  {path: 'distributor', component: DistributorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
