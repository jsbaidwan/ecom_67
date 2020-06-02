import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products_arr = [];
  showSpinner: boolean = true;
  constructor(
    private alert:NotificationService, 
    private http:HttpClient,
  ) 
  { 
    
  }

  ngOnInit(): void {
    this.http.get<any>('http://localhost/pos/backend/api/get_products').subscribe(
      (data) => {
        this.showSpinner = false;
        if(data.success) {
          this.products_arr = data.data;  
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
