import { Component } from '@angular/core';
import { NotificationService } from './services/notification/notification.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpinnerService } from './services/spinner/spinner.service'
import { ProgressBarService } from './services/progress_bar/progress-bar.service'
import { environment } from '../environments/environment';
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
    private spinner: SpinnerService,
    private progress_bar: ProgressBarService
  ) { }
  categories_arr = [];
  show_progress_bar = this.progress_bar.visibility
  show_spinner = this.spinner.visibility
  ngOnInit(): void {
    this.http.get<any>(environment.baseUrl+'/api/get_categories').subscribe(
      (data) => {
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
