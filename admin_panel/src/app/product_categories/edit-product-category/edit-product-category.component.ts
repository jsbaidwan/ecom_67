import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-edit-product-category',
  templateUrl: './edit-product-category.component.html',
  styleUrls: ['./edit-product-category.component.css']
})
export class EditProductCategoryComponent implements OnInit {
  category_id = '';
  edit_product_category_form: FormGroup;
  submitted = false;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private notifyService : NotificationService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category_id = params['id'];
    });
    this.http.get<any>(environment.baseUrl+'/api/categories/'+this.category_id).subscribe(
      (data) => {
        if(data.success) {
          this.edit_product_category_form = this.formBuilder.group({
            category_name: [data.data.category_name, Validators.required],
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
  get f() { return this.edit_product_category_form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.edit_product_category_form.invalid) {
        return;
    }
    this.http.post<any>('http://localhost/pos/backend/api/update_category', {
      category_name: this.edit_product_category_form.get('category_name').value,
      category_id: this.category_id,
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
