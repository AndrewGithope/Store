import { HttpClient } from '@angular/common/http';
import { inject, Injectable, } from '@angular/core';
import { tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../../shared/models/auth.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);
    private baseUrl = 'https://dummyjson.com';
    private tokenKey = 'fragrance_auth_token';

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
            tap(response => this.saveToken(response.accessToken))
        )
    }

    register(userData: RegisterRequest): Observable<UserProfile>{
        return this.http.post<UserProfile>(`${this.baseUrl}/users/add`, userData);
    }

    getCurrentUser(): Observable<UserProfile>{
        return this.http.get<UserProfile>(`${this.baseUrl}/auth/me`)
    }

    saveToken(token: string):void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
    }
    
}
