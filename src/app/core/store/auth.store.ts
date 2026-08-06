import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginRequest, UserProfile } from '../../shared/models/auth.interface';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';




interface AuthState {
    user: UserProfile | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}


const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('freagrance_auth_token'),
    isLoading: false,
    error: null
}

export const AuthStore = signalStore(
    withState(initialState),
    withComputed((store) => ({
        isAuthenticated: computed(() => !!store.token()),
        userName: computed(() => store.user() ? `${store.user()?.firstName} ${store.user()?.lastName}` : `Gost`)
    })),
    withMethods((store, authService = inject(AuthService)) => ({
        login: rxMethod<LoginRequest>(
            pipe(
                tap(() => patchState(store, {isLoading: true, error: null})),
                switchMap((credentials) => 
                    authService.login(credentials).pipe(
                        tap((response) => {
                            patchState(store, {
                                user: response,
                                token: response.accessToken,
                                isLoading: false,
                                error: null
                            });
                        }),
                        catchError((err) => {
                            patchState(store, {
                                isLoading: false,
                                error: err.error?.message || 'Login erro'
                            });
                            return EMPTY;
                        })
                    )
                )
            )
        ),
        logout():void {
            authService.logout();
            patchState(store, {user: null, token: null, error: null})
        }
    }))
)




