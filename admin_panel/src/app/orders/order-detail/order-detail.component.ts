import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import {ActivatedRoute} from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order_id = '';
  order_details : any;
  constructor(private http: HttpClient, private notifyService : NotificationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.order_id = params['id'];
    });
    this.http.get<any>(environment.baseUrl+'/api/get_order_details/'+this.order_id).subscribe(
      (data) => {
        if(data.success) {
          this.order_details = data.data;
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
