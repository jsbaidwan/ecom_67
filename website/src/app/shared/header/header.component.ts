import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cart_items_count: any;
  count: number;
  message:string;
  constructor(
    private data: SharedService,
  ) 
  {
  }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => {
      this.cart_items_count = message;
    })
    
  }


}
