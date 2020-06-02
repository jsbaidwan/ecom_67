import { Component } from '@angular/core';
import { NotificationService } from './services/notification/notification.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpinnerService } from './services/spinner/spinner.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showSpinner: boolean;
  constructor(
    private alert:NotificationService, 
    private http:HttpClient,
    public spinner: SpinnerService
  ) { }
  categories_arr = [];
  ngOnInit(): void {
    this.spinner.show();
    this.http.get<any>('http://localhost/pos/backend/api/get_categories').subscribe(
      (data) => {
        this.spinner.hide();
        if(data.success) {
          this.categories_arr = data.data;  
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
