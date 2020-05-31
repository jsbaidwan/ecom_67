import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  add_product_form: FormGroup;
  submitted = false;
  categories_arr = [];
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private notifyService : NotificationService) {}

  ngOnInit() {
    this.http.get<any>('http://localhost/pos/backend/api/get_categories').subscribe(
      (data) => {
        if(data.success) {
          this.categories_arr = data.data;  
        }
        else {
          for(var i in data.msg) {
            this.notifyService.showError(data.msg[i], "");
          }  
        }
      },
      (error) => this.notifyService.showError(error.message, "")
    );
    this.add_product_form = this.formBuilder.group({
      product_name: ['', Validators.required],
      category_id: ['', Validators.required],
      price: ['', Validators.required],
      pcs: ['', Validators.required],
      product_description: [''],
    });
  }
  get f() { return this.add_product_form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.add_product_form.invalid) {
        return;
    }
    this.http.post<any>('http://localhost/pos/backend/api/add_product', {
        product_name: this.add_product_form.get('product_name').value,
        category_id: this.add_product_form.get('category_id').value,
        price: this.add_product_form.get('price').value,
        pcs: this.add_product_form.get('pcs').value,
        product_description: this.add_product_form.get('product_description').value,
    }).subscribe(
      (data) => {
        if(data.success) {
          this.notifyService.showSuccess(data.msg.text, "");
          this.router.navigateByUrl('/products');
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
