import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
    template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">lock</mat-icon> Sign In
      </h2>
      
      <mat-dialog-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Enter your name (e.g. Andrew)">
            <mat-icon matSuffix class="field-icon">account_circle</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Enter your password">
            <mat-icon matSuffix class="field-icon">key</mat-icon>
          </mat-form-field>

          <div *ngIf="authStore.error()" class="error-banner">
            <mat-icon>error_outline</mat-icon>
            <span>{{ authStore.error() }}</span>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button mat-dialog-close>Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="loginForm.invalid || authStore.isLoading()" 
          (click)="onSubmit()">
          {{ authStore.isLoading() ? 'Signing in...' : 'Sign In' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 8px; }
    .dialog-title { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .auth-form { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
    .full-width { width: 100%; }
    .field-icon { color: rgba(0, 0, 0, 0.54); }
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      color: #d32f2f; background-color: #ffebee;
      padding: 8px 12px; border-radius: 4px; font-size: 0.85rem;
    }
    .dialog-actions { padding-top: 16px; }
  `]
})
export class AuthDialogComponent {
  private fb = inject(FormBuilder);
  readonly authStore = inject(AuthStore);
  private dialogRef = inject(MatDialogRef<AuthDialogComponent>);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authStore.login({ username: username!, password: password! });

      setTimeout(() => {
        if (this.authStore.isAuthenticated()) {
          const name = this.authStore.user()?.firstName || username;
          this.snackBar.open(`Welcome back, ${name}! 👋`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.dialogRef.close();
        }
      }, 300);
    }
  }
}

