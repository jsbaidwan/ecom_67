import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProgressBarService } from '../../services/progress_bar/progress-bar.service'
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products_arr = [];
  constructor(
    private alert:NotificationService, 
    private http:HttpClient,
    public progress_bar: ProgressBarService
  ) 
  { 
    
  }

  ngOnInit(): void {
    this.progress_bar.show();
    this.http.get<any>(environment.baseUrl+'/api/get_products').subscribe(
      (data) => {
        this.progress_bar.hide();
        if(data.success) {
          this.products_arr = data.data;  
        }
        else {
          this.progress_bar.hide();
          for(var i in data.msg) {
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
