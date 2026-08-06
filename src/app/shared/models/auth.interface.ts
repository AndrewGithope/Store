export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface AuthResponse extends UserProfile {
  accessToken: string;
  refreshToken: string;
}