import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { SharedService } from '../../services/shared/shared.service';
import { SpinnerService } from '../../services/spinner/spinner.service'
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order_form: FormGroup;
  submitted = false;
  cart_arr:any = [];
  cart_details:any = [];
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder, 
    private router: Router, 
    private alert : NotificationService,
    private data: SharedService,
    private spinner: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.order_form = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      comment: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],  
      postcode: ['', Validators.required],  
      country: ['', Validators.required],  
      state: ['', Validators.required],  
    });

    if(localStorage.getItem('cart') != null) {
      this.cart_arr = localStorage.getItem('cart');
      this.cart_arr = JSON.parse(this.cart_arr);
      if(this.cart_arr.length < 1) {
        this.router.navigate(['']);
      }
      this.calculate_total();
    }
    else {
      this.router.navigate(['']);
    }
  }
  get f() { return this.order_form.controls; }
  calculate_total() {
    var sub_total = 0;
    var total = 0;
    var tax = 13;
    var tax_amount:any = 0;
    for (var i in this.cart_arr) {
      this.cart_arr[i].total = this.cart_arr[i].price*this.cart_arr[i].quantity;
      sub_total = sub_total+this.cart_arr[i].total;
    }
    tax_amount = (13/100)*sub_total;
    total = sub_total+tax_amount;
    this.cart_details = {
      "sub_total" : sub_total,
      "total" : total,
      "tax" : "13",
    };
    this.data.changeMessage(this.cart_arr.length)
  }
  onSubmit() {
    this.submitted = true;
    if (this.order_form.invalid) {
        return;
    }
    this.spinner.show();
    var purchased_items = JSON.parse(localStorage.getItem('cart'));
    this.http.post<any>('http://localhost/pos/backend/api/place_order', {
      first_name: this.order_form.get('first_name').value,
      last_name: this.order_form.get('last_name').value,
      email: this.order_form.get('email').value,
      phone: this.order_form.get('phone').value,
      comment: this.order_form.get('comment').value,
      address: this.order_form.get('address').value,
      city: this.order_form.get('city').value,
      postcode: this.order_form.get('postcode').value,
      state: this.order_form.get('state').value,
      country: this.order_form.get('country').value,
      purchased_items: purchased_items
    }).subscribe(
      (data) => {
        this.spinner.hide();
        if(data.success) {
          this.data.changeMessage('0');
          this.alert.showSuccess(data.msg.text, "");
          localStorage.removeItem('cart');
          this.router.navigate(['']);
        }
        else {
          this.spinner.hide();
          for(var i in data.msg) {
            this.alert.showError(data.msg[i], "");
          }  
        }
      },
      (error => {
        this.spinner.hide();
        this.alert.showError(error.message, "")
      })
    );
  }
}
