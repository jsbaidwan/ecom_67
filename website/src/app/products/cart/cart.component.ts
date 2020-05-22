import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart_arr:any = [];
  cart_details:any = [];
  constructor(private alert:NotificationService) { }

  ngOnInit(): void {
    if(localStorage.getItem('cart') != null) {
      this.cart_arr = localStorage.getItem('cart');
      this.cart_arr = JSON.parse(this.cart_arr);
      this.calculate_total();
    }
  }
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
  }
  update_cart(index,type) {
    if(type == 'sub') {
      if(this.cart_arr[index].quantity > 1) {
        this.cart_arr[index].quantity = this.cart_arr[index].quantity-1;
      }
      else {
        this.alert.showError("Quantity can not be less than 1.", "");
        return;
      }
    }
    else if(type == 'add') {
      if(this.cart_arr[index].quantity < this.cart_arr[index].pcs || this.cart_arr[index].quantity == this.cart_arr[index].pcs) {
        this.cart_arr[index].quantity = this.cart_arr[index].quantity+1;
      }
      else {
        this.alert.showError("Quantity exceeded than available stock.", "");
        return;
      }
    }
    else {
      this.alert.showError("Quantity exceeded than available stock.", "");
      return;
    }
    this.calculate_total(); 
  }
}
