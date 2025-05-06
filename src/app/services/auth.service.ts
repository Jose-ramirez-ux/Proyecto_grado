import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  login(username: string, password: string): Observable<any> {
    // Simula una respuesta de login con retraso
    return of({ token: 'simulated_token_123' }).pipe(
      delay(1000),
      tap(response => {
        this.token = response.token;
        localStorage.setItem('auth_token', response.token);
      })
    );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return of({ success: true }).pipe(delay(1000));
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}


/*@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://tu-backend-laravel.com/api'; // Cambia esta URL por la de tu API Laravel
  private token: string | null = null;

  constructor(private http: HttpClient) {
    // Comprobar si hay un token guardado en el localStorage
    this.token = localStorage.getItem('auth_token');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.token = response.token;
            localStorage.setItem('auth_token', response.token);
          }
        })
      );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password, email });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}*/
// Este servicio simula la autenticación y el registro de usuarios. En un entorno real, deberías hacer peticiones HTTP a tu backend para autenticar y registrar usuarios.