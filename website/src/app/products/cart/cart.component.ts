import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../services/shared/shared.service';
import {Router } from '@angular/router';
import { ProgressBarService } from '../../services/progress_bar/progress-bar.service'
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart_arr:any = [];
  cart_details:any = [];
  product_ids = "";
  cart_quantity_arr:any = [];
  show_cart_arr:any = [];
  received_product_details_arr:any = [];
  constructor(
    private alert:NotificationService, 
    private http:HttpClient,
    private data: SharedService,
    private router: Router,
    public progress_bar: ProgressBarService
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('cart') != null) {
      this.cart_arr = localStorage.getItem('cart');
      this.cart_arr = JSON.parse(this.cart_arr);
      if(this.cart_arr.length < 1) {
        this.router.navigate(['']);
      }
      else {
        this.progress_bar.show();
        for (var i in this.cart_arr) {
          this.cart_quantity_arr[this.cart_arr[i].id] = this.cart_arr[i].quantity
          if(this.product_ids == '') {
            this.product_ids = this.cart_arr[i].id
          }
          else {
            this.product_ids = this.product_ids+','+this.cart_arr[i].id
          }
        }
        this.http.get<any>(environment.baseUrl+'/api/get_cart_products_detail/'+this.product_ids).subscribe(
          (data) => {
            if(data.success) {
              this.received_product_details_arr = data.data
              var product_detail
              var sub_total = 0;
              for (var j in this.received_product_details_arr) {
                var product_total_price = this.received_product_details_arr[j].price*this.cart_quantity_arr[this.received_product_details_arr[j].id]
                var product_quantity = this.cart_quantity_arr[this.received_product_details_arr[j].id]
                product_detail =
                  {
                    "id": this.received_product_details_arr[j].id,
                    "product_name": this.received_product_details_arr[j].product_name,
                    "price": this.received_product_details_arr[j].price,
                    "total": product_total_price,
                    'pcs' : this.received_product_details_arr[j].pcs,
                    "quantity": product_quantity
                  }
                this.show_cart_arr.push(product_detail)
                sub_total = sub_total+product_total_price;
              }
              this.cart_arr = this.show_cart_arr
              
              var total = 0;
              var tax = 13;
              var tax_amount:any = 0;
              tax_amount = (13/100)*sub_total;
              total = sub_total+tax_amount;
              this.cart_details = {
                "sub_total" : sub_total,
                "total" : total,
                "tax_amount": tax_amount,
                "tax" : "13",
              };
              this.data.changeMessage(this.cart_arr.length)
              this.progress_bar.hide();
            }
            else {
              for(var i in data.msg) {
                this.progress_bar.hide();
                this.alert.showError(data.msg[i], "");
              }  
            }
          },
          (error => {
            this.progress_bar.hide();
            this.alert.showError(error.message, "")
          })
        );
      }
    }
    else {
      this.router.navigate(['']);
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
      "tax_amount": tax_amount,
      "tax" : "13",
    };
    this.data.changeMessage(this.cart_arr.length)
  }
  update_cart(index,type) {
    if(type == 'sub') {
      if(this.cart_arr[index].quantity > 1) {
        this.cart_arr[index].quantity = this.cart_arr[index].quantity-1;
        localStorage.setItem('cart', JSON.stringify(this.cart_arr));
      }
      else {
        this.alert.showError("Quantity can not be less than 1.", "");
        return;
      }
    }
    else if(type == 'add') {
      if(this.cart_arr[index].quantity < this.cart_arr[index].pcs) {
        this.cart_arr[index].quantity = this.cart_arr[index].quantity+1;
        localStorage.setItem('cart', JSON.stringify(this.cart_arr));
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
  remove_item(product_index) {
    if(confirm('Are you sure to remove this item from cart?')) {
      this.cart_arr.splice(product_index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart_arr));
      this.calculate_total();
    }
  }
}
