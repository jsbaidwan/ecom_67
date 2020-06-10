import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products_arr = '';
  constructor(private http: HttpClient, private notifyService : NotificationService) {}
    ngOnInit(): void {
      this.http.get<any>(environment.baseUrl+'/api/products').subscribe(
        (data) => {
          if(data.success) {
            this.products_arr = data.data;
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
  
    change_status(index, status, id) {
      if(status != 0 && status != 1) {
        this.notifyService.showError("Invalid Parameter.", "");
        return;
      }
      this.http.post<any>(environment.baseUrl+'/api/update_product_status', {
        status: status, 
        product_id: id,     
      }).subscribe(
        (data) => {
          if(data.success) {
            this.notifyService.showSuccess(data.msg['text'], "");
            if(status) {
              this.products_arr[index]['status'] = 0;
            }
            else {
              this.products_arr[index]['status'] = 1;
            }
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
