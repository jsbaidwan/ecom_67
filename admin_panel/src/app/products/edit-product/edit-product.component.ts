import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { NotificationService } from '../../services/toaster_notification/notification.service';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product_id = '';
  edit_product_form: FormGroup;
  submitted = false;
  categories_arr = [];
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private notifyService : NotificationService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.product_id = params['id'];
    });
    this.http.get<any>('http://localhost/pos/backend/api/products/'+this.product_id).subscribe(
      (data) => {
        if(data.success) {
          this.categories_arr = data.data.categories;
          this.edit_product_form = this.formBuilder.group({
            product_name: [data.data.product_name, Validators.required],
            category_id: [data.data.category_id, Validators.required],
            price: [data.data.price, Validators.required],
            pcs: [data.data.pcs, Validators.required],
            product_description: [data.data.product_description],
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
  get f() { return this.  edit_product_form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.edit_product_form.invalid) {
        return;
    }
    this.http.post<any>('http://localhost/pos/backend/api/update_product', {
      product_name: this.edit_product_form.get('product_name').value,
      price: this.edit_product_form.get('price').value,
      pcs: this.edit_product_form.get('pcs').value,
      product_description: this.edit_product_form.get('product_description').value,
      category_id: this.edit_product_form.get('category_id').value,
      product_id: this.product_id,
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
