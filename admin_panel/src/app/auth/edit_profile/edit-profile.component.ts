import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import{ AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  edit_profile_form: FormGroup;
  submitted = false;
  response_data = '';
  constructor(
    private http: HttpClient, 
    private formBuilder: FormBuilder,
    private router: Router, 
    private auth_service: AuthService,
    private notifyService : NotificationService
    ) 
    {}

  ngOnInit() {
    this.http.get<any>(environment.baseUrl+'/api/user').subscribe(
      (data) => {
        if(data.success) {
          this.edit_profile_form = this.formBuilder.group({
            first_name: [data.first_name, Validators.required],
            last_name: [data.last_name],
            email: [data.email, [Validators.required, Validators.email]],
            phone: [data.phone, Validators.required],
          });
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
  get f() { return this.edit_profile_form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.edit_profile_form.invalid) {
        return;
    }
    this.http.post<any>(environment.baseUrl+'/api/save_profile', {
      first_name: this.edit_profile_form.get('first_name').value,
      last_name: this.edit_profile_form.get('last_name').value,
      email: this.edit_profile_form.get('email').value,
      phone: this.edit_profile_form.get('phone').value,
    }).subscribe(
      (data) => {
        if(data.success) {
          var user_data = JSON.parse(localStorage.getItem('currentUser'));
          user_data['user_details']['first_name'] = this.edit_profile_form.get('first_name').value;
          user_data['user_details']['last_name'] = this.edit_profile_form.get('last_name').value;
          user_data['user_details']['email'] = this.edit_profile_form.get('email').value;
          user_data['user_details']['phone'] = this.edit_profile_form.get('phone').value;
          this.auth_service.changeMessage(user_data)
          localStorage.setItem('currentUser', JSON.stringify(user_data));
          this.notifyService.showSuccess(data.msg.text, "");
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
