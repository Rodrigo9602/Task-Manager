// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../../interfaces/user';
import { AuthService } from '../security/security.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Método privado para verificar si el usuario actual es administrador
  private verifyAdminAccess(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }
    
    if (currentUser.role !== 'Admin') {
      throw new Error('Acceso denegado: Se requieren permisos de administrador');
    }
  }

  // Obtener todos los usuarios (solo admin)
  getAllUsers(): Observable<User[]> {
    try {
      this.verifyAdminAccess();
      return this.http.get<User[]>(
        `${this.API_URL}/users`,
        { headers: this.headers }
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Obtener un usuario específico (solo admin)
  getUser(userId: number): Observable<User> {
    try {
      this.verifyAdminAccess();
      return this.http.get<User>(
        `${this.API_URL}/users/${userId}`,
        { headers: this.headers }
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Editar información del usuario (solo admin)
  updateUser(userId: number, userData: Partial<Omit<User, 'id' | 'password'>>): Observable<User> {
    try {
      this.verifyAdminAccess();
      return this.http.patch<User>(
        `${this.API_URL}/users/${userId}`,
        userData,
        { headers: this.headers }
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Eliminar usuario (solo admin)
  deleteUser(userId: number): Observable<void> {
    try {
      this.verifyAdminAccess();
      return this.http.delete<void>(
        `${this.API_URL}/users/${userId}`,
        { headers: this.headers }
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}