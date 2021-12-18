import {Component, Input, OnInit} from '@angular/core';
import {DemandService} from "../../services/demand.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input()
  notDoneDemands?: number;

  constructor(private demandService: DemandService) {
  }

  ngOnInit(): void {
    this.demandService.countByIsDoneFalse().subscribe(count => {
      this.notDoneDemands = count;
    })
  }

}
