import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthStore } from '../../../core/store/auth.store';
import { cartStore } from '../../../core/store/cart.store';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    AuthDialogComponent,
    RouterLink
],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {
  readonly authStore = inject(AuthStore);
  readonly cartStore = inject(cartStore);
  private dialog = inject(MatDialog);
  private router = inject(Router);



  openAuthDialog(): void {
    this.dialog.open(AuthDialogComponent, {
      width: '400px'
    });
  }


  logout(): void{
    this.authStore.logout();
  }

  opencart(): void {
    this.router.navigate(['/cart']);
  }

  scrollTo(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  }
}
















