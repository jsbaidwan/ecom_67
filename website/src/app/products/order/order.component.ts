import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order_form: FormGroup;
  submitted = false;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private alert : NotificationService) {}

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
  }
  get f() { return this.order_form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.order_form.invalid) {
        return;
    }
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
        if(data.success) {
          this.alert.showSuccess(data.msg.text, "");
          localStorage.removeItem('cart');
          this.router.navigate(['']);
        }
        else {
          for(var i in data.msg) {
            this.alert.showError(data.msg[i], "");
          }  
        }
      },
      (error) => this.alert.showError(error.message, "")
    );
  }
}
