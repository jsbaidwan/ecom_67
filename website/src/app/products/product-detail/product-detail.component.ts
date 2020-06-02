import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Router, NavigationEnd } from '@angular/router';
import { ProgressBarService } from '../../services/progress_bar/progress-bar.service'
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product_details:any = [];
  related_products_arr:any = [];
  product_id = '';
  cart_arr: any;
  added_in_cart = false;

  constructor(
    private alert:NotificationService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private http:HttpClient,
    public progress_bar: ProgressBarService
  ) 
  { 
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.progress_bar.show();
        this.added_in_cart = false;
        this.route.params.subscribe(params => {
          this.product_id = params['id'];
        });
        this.http.get<any>('http://localhost/pos/backend/api/get_product/'+this.product_id).subscribe(
          (data) => {
            this.progress_bar.hide();
            if(data.success) {
              this.product_details = data.data.product;
              this.related_products_arr = data.data.related_products;  
              if(localStorage.getItem('cart') != null) {
                this.cart_arr = localStorage.getItem('cart');
                this.cart_arr = JSON.parse(this.cart_arr);
                for (i in this.cart_arr){
                  if (this.cart_arr[i].id == this.product_id) {
                    this.added_in_cart = true;
                  }
                }
              }
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
    });
  }

  ngOnInit(): void {
  }
  add_to_cart(product_id, product_name, price, pcs) {
    if(localStorage.getItem('cart') == null) {
      var item = [{
        "id": product_id,
        "product_name": product_name,
        "price": price,
        "total": price,
        'pcs' : pcs,
        "quantity": 1
      }];
      localStorage.setItem('cart', JSON.stringify(item));
    }
    else {
      var itemm = {
        "id": product_id,
        "product_name": product_name,
        "price": price,
        "total": price,
        'pcs' : pcs,
        "quantity": 1
      };
      let cart: any = [];
      cart = localStorage.getItem('cart');
      cart = JSON.parse(cart);
      cart.push(itemm);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    this.router.navigateByUrl('/cart');
  }
}

