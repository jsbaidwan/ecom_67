import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public static currentUser: string = localStorage.getItem('currentUser');
  user_details = JSON.parse(localStorage.getItem('currentUser'));
  private messageSource = new BehaviorSubject(this.user_details);
  currentMessage = this.messageSource.asObservable();
  constructor() { }
  changeMessage(message: string) {
    this.messageSource.next(message)
  }
}
