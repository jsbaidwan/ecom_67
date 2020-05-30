import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import{ AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser:any;
  constructor(public router: Router, private auth_service:AuthService) {}

  ngOnInit(): void {
    this.auth_service.currentMessage.subscribe(message => {
      this.currentUser = message;
    })
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['']);
  }

}
