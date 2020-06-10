import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  add_category_form: FormGroup;
  submitted = false;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private notifyService : NotificationService) {}

  ngOnInit() {
    this.add_category_form = this.formBuilder.group({
      category_name: ['', Validators.required],
    });
  }
  get f() { return this.add_category_form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.add_category_form.invalid) {
        return;
    }
    this.http.post<any>(environment.baseUrl+'/api/add_category', {
        category_name: this.add_category_form.get('category_name').value,
    }).subscribe(
      (data) => {
        if(data.success) {
          this.notifyService.showSuccess(data.msg.text, "");
          this.router.navigateByUrl('/categories');
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
