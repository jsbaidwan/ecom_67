import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cart_items_count: any = 0;
  message:string;
  constructor(
    private data: SharedService,
  ) 
  {

  }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => {
      this.calculate_cart()
    })
    
  }
  calculate_cart() {
    if(localStorage.getItem('cart') != null) {
      var count = JSON.parse(localStorage.getItem('cart'));
      this.cart_items_count = count.length;
    }
    else {
      this.cart_items_count = 0;
    }
  }

}
