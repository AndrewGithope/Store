import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private cartService = inject(CartService);

  totalCount = this.cartService.totalItemsCount;
}
