import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
  email?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, http = inject(HttpClient)) => ({
    login(credentials: { username: string; password?: string }) {
      patchState(store, { isLoading: true, error: null });

      // Подменяем данные для DummyJSON: отправляем валидные emilys / emilyspass
      const dummyPayload = {
        username: 'emilys',
        password: 'emilyspass'
      };

      http.post<any>('https://dummyjson.com/auth/login', dummyPayload).pipe(
        tap((response) => {
          // Создаем объект пользователя с ИМЕНЕМ, которое ввел юзер (Андрей, Джонни и т.д.)
          const user: User = {
            id: response.id,
            username: credentials.username, // Имя из формы ввода!
            firstName: credentials.username, // Для отображения в шапке
            lastName: '',
            email: `${credentials.username.toLowerCase()}@fragrance.com`,
            token: response.accessToken || response.token // Настоящий JWT от сервера
          };

          // Сохраняем сессию
          localStorage.setItem('token', user.token!);
          localStorage.setItem('user', JSON.stringify(user));

          patchState(store, {
            user,
            token: user.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }),
        catchError(() => {
          patchState(store, {
            isLoading: false,
            error: 'Authentication failed. Please try again.'
          });
          return of(null);
        })
      ).subscribe();
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      patchState(store, {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      });
    }
  }))
);