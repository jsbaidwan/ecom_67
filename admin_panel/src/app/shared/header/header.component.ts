import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import{ AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser = JSON.parse(AuthService.currentUser);
  constructor(public router: Router) {}

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['']);
  }

}
