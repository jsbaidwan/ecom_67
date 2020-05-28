import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { LeftBarComponent } from './shared/left_bar/left-bar.component';
import { HeaderComponent } from './shared/header/header.component'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
import { EditProfileComponent } from './auth/edit_profile/edit-profile.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { CategoriesComponent } from './product_categories/categories_list/categories.component';
import { AddCategoryComponent } from './product_categories/add_category/add-category.component';
import { EditProductCategoryComponent } from './product_categories/edit-product-category/edit-product-category.component';
import { ProductsComponent } from './products/products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { OrdersComponent } from './orders/orders/orders.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LeftBarComponent,
    HeaderComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    CategoriesComponent,
    AddCategoryComponent,
    EditProductCategoryComponent,
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    OrdersComponent,
    OrderDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
