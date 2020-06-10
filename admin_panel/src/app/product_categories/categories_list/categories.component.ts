import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationService } from '../../services/toaster_notification/notification.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
categories_arr = '';
constructor(private http: HttpClient, private notifyService : NotificationService) {}
  ngOnInit(): void {
    this.http.get<any>(environment.baseUrl+'/api/categories').subscribe(
      (data) => {
        if(data.success) {
          this.categories_arr = data.data;
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
    this.http.post<any>(environment.baseUrl+'/api/update_category_status', {
      status: status, 
      category_id: id,     
    }).subscribe(
      (data) => {
        if(data.success) {
          this.notifyService.showSuccess(data.msg['text'], "");
          if(status) {
            this.categories_arr[index]['status'] = 0;
          }
          else {
            this.categories_arr[index]['status'] = 1;
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
