import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard'; 
import { EditProfileComponent } from './auth/edit_profile/edit-profile.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { CategoriesComponent } from './product_categories/categories_list/categories.component';
import { AddCategoryComponent } from './product_categories/add_category/add-category.component';
import { EditProductCategoryComponent } from './product_categories/edit-product-category/edit-product-category.component';
import { ProductsComponent } from './products/products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate : [AuthGuard], component: DashboardComponent },
  { path: 'edit_profile', canActivate : [AuthGuard], component: EditProfileComponent },
  { path: 'change_password', canActivate : [AuthGuard], component: ChangePasswordComponent },
  { path: 'categories', canActivate : [AuthGuard], component: CategoriesComponent },
  { path: 'categories/add_product_category', canActivate : [AuthGuard], component: AddCategoryComponent },
  { path: 'categories/:id', canActivate : [AuthGuard], component: EditProductCategoryComponent },
  { path: 'products', canActivate : [AuthGuard], component: ProductsComponent },
  { path: 'products/add_product', canActivate : [AuthGuard], component: AddProductComponent },
  { path: 'products/:id', canActivate : [AuthGuard], component: EditProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
