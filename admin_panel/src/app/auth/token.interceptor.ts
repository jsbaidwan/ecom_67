import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { tokenName } from '@angular/compiler';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    currentUser = JSON.parse(AuthService.currentUser);
    token = '';
    constructor() {
      if(this.currentUser == null) {
        this.token = '';
      }
      else {
        this.token = this.currentUser['token'];
      }
    }

    intercept(
    request: HttpRequest<any>,
    next: HttpHandler
    ): Observable<HttpEvent<any>> {
    request = request.clone({
        setHeaders: {
        Authorization: 'Bearer '+this.token,
        },
    });

    return next.handle(request);
    }
}
