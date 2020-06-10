import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  change_password_form: FormGroup;
  submitted = false;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private notifyService : NotificationService) {}

  ngOnInit() {
    this.change_password_form = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }
  get f() { return this.change_password_form.controls; }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    //console.warn(this.login_form.get('email').value);
    this.submitted = true;
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.login_form.value, null, 4));
    if (this.change_password_form.invalid) {
        return;
    }
    this.http.post<any>(environment.baseUrl+'/api/change_password', {
      old_password: this.change_password_form.get('old_password').value,
      new_password: this.change_password_form.get('new_password').value,
      confirm_password: this.change_password_form.get('confirm_password').value,
    }).subscribe(
      (data) => {
        if(data.success) {
          this.notifyService.showSuccess(data.msg.text, "");
        }
        else {
          for(var i in data.msg) {
            this.notifyService.showError(data.msg[i], "");
          } 
        }
      },
      (error) => console.error(error)
    );
  }
}
