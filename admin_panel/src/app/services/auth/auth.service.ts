import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public static currentUser: string = localStorage.getItem('currentUser');
  constructor() { }
}
