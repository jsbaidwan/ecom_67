import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  reset_password_link_form: FormGroup;
  submitted = false;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private notifyService : NotificationService) {}

  ngOnInit() {
    this.reset_password_link_form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  get f() { return this.reset_password_link_form.controls; }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    //console.warn(this.reset_password_link_form.get('email').value);
    this.submitted = true;
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.reset_password_link_form.value, null, 4));
    if (this.reset_password_link_form.invalid) {
        return;
    }
    this.http.post<any>(environment.baseUrl+'/api/forget_password', {
        email: this.reset_password_link_form.get('email').value,
    }).subscribe(
      (data) => {
        if(data.success) {
          //this.notifyService.showSuccess(data.msg.text, "");
          //this.router.navigateByUrl('/dashboard');
        }
        else {
          for(var i in data.msg) {
            this.notifyService.showError(data.msg[i], "");
          }   
        }
      },
      (error) => this.notifyService.showError(error.message, "")
    );
  }

}
