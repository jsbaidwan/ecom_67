import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders_arr = [];
  constructor(private http: HttpClient, private notifyService : NotificationService) {}

  ngOnInit(): void {
    this.http.get<any>(environment.baseUrl+'/api/get_orders').subscribe(
      (data) => {
        if(data.success) {
          this.orders_arr = data.data;
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
