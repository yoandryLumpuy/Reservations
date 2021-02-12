import { EditReservationComponent } from './_components/edit-reservation/edit-reservation.component';
import { BannerStructureService } from 'src/app/_services/banner-structure.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { AfterViewInit, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { defaultBannerStructure } from './_model/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(@Inject(AuthService) private authService : AuthService, private bannerStructureService: BannerStructureService){}   

  ngOnInit(): void {  
    this.authService.autologin();

    this.bannerStructureService.updateBanner({
      ...defaultBannerStructure,
      leftText: 'Create a Reservation',
      middleText : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.' 
           + 'Nemo odio cum voluptatibus sapiente deleniti magni, officia et ab minus blanditiis.',
      navigationButtonText: 'Reservation List',
      emittedBy: this
    });
  }
}
