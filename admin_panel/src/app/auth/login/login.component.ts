import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login_form: FormGroup;
  submitted = false;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private notifyService : NotificationService) {}

  ngOnInit() {
    this.login_form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  get f() { return this.login_form.controls; }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    //console.warn(this.login_form.get('email').value);
    this.submitted = true;
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.login_form.value, null, 4));
    if (this.login_form.invalid) {
        return;
    }
    this.http.post<any>('http://localhost/pos/backend/api/login', {
        email: this.login_form.get('email').value,
        password: this.login_form.get('password').value,
    }).subscribe(
      (data) => {
        if(data.success) {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.notifyService.showSuccess(data.msg.text, "");
          this.router.navigateByUrl('/dashboard');
        }
        else {
          this.notifyService.showError("Email or password is incorrect.", "")  
        }
      },
      (error) => this.notifyService.showError(error.message, "")
    );
  }
}
