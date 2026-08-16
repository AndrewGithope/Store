import { Routes } from '@angular/router';
import { ProductListComponent } from './features/product-list/product-list';
import { ProductDetails } from './features/product-details/product-details';
import { Cart } from './features/cart/cart';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: Cart }
];