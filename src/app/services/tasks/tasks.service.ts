// TaskService actualizado
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { Task } from '../../interfaces/task';
import { AuthService } from '../security/security.service';
import { StateType } from '../../interfaces/task';

@Injectable({
providedIn: 'root'
})
export class TaskService {
private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
private readonly API_URL = 'http://localhost:3000';

constructor(
  private http: HttpClient,
  private authService: AuthService
) {}

// Crear una nueva tarea
createTask(taskData: Omit<Task, 'id' | 'start_date' | 'state' | 'userId'>, assignedUserId?: number): Observable<Task> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser) {
    throw new Error('Usuario no autenticado');
  }

  // Preparamos la tarea con el estado inicial "Pendiente"
  const newTask: Omit<Task, 'id'> = {
    ...taskData,
    start_date: new Date(),
    state: 'Pendiente',
    userId: undefined,
  };

  // Si es admin y proporciona un userId, asignamos la tarea
  if (currentUser.role === 'Admin' && assignedUserId) {
    newTask.userId = assignedUserId;
  } else if (currentUser.role === 'Admin' && !assignedUserId) {
    // Si es admin pero no proporciona userId, la tarea queda sin asignar
    newTask.userId = undefined;
  } else if (currentUser.role !== 'Admin' && assignedUserId === currentUser.id) {
    newTask.userId = assignedUserId;
  } else if (currentUser.role !== 'Admin' && assignedUserId !== currentUser.id) {
    // Si un usuario normal intenta asignar la tarea, rechazamos la operación
    return throwError(() => new Error('No tienes permisos para asignar tareas'));
  }  

  return this.http.post<Task>(
    `${this.API_URL}/tasks`,
    newTask,
    { headers: this.headers }
  );
}

// Obtener tareas según el rol
getTasks(): Observable<Task[]> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser) {
    throw new Error('Usuario no autenticado');
  }

  let params = new HttpParams();

  if (currentUser.role !== 'Admin') {
    // Para usuarios normales, solo mostramos sus tareas asignadas
    params = params.set('userId', currentUser.id.toString());
  }

  return this.http.get<Task[]>(
    `${this.API_URL}/tasks`,
    { 
      headers: this.headers,
      params: params
    }
  );
}

// Obtener las tareas asignadas a un usuario solo admin
getUserTasks(userId:string): Observable<Task[]> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'Admin') {
    return throwError(() => new Error('No tienes permisos para ver tareas asignadas a otros usuarios'));
  }
  
  let params = new HttpParams();
  params = params.set('userId', userId);
  
  return this.http.get<Task[]>(
    `${this.API_URL}/tasks`,
    { 
      headers: this.headers,
      params: params
    }
  );
}

// Obtener tareas sin asignar (solo para Admin)
getUnassignedTasks(): Observable<Task[]> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'Admin') {
    return throwError(() => new Error('No tienes permisos para ver tareas sin asignar'));
  }

  // En json-server, podemos usar el parámetro userId_like=null para obtener tareas sin asignar
  return this.http.get<Task[]>(
    `${this.API_URL}/tasks?userId_like=null`,
    { headers: this.headers }
  );
}

// Asignar una tarea a un usuario (solo Admin)
assignTask(taskId: number, userId: number): Observable<Task> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'Admin') {
    return throwError(() => new Error('No tienes permisos para asignar tareas'));
  }

  return this.http.patch<Task>(
    `${this.API_URL}/tasks/${taskId}`,
    { userId: userId },
    { headers: this.headers }
  );
}

// Desasignar una tarea (solo Admin)
unassignTask(taskId: number): Observable<Task> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'Admin') {
    return throwError(() => new Error('No tienes permisos para desasignar tareas'));
  }

  return this.http.patch<Task>(
    `${this.API_URL}/tasks/${taskId}`,
    { userId: null },
    { headers: this.headers }
  );
}

// Actualizar estado de una tarea
updateTaskState(taskId: number, newState: StateType): Observable<Task> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser) {
    return throwError(() => new Error('Usuario no autenticado'));
  }

  // Verificamos que el usuario tenga permiso para actualizar esta tarea
  return this.http.get<Task>(`${this.API_URL}/tasks/${taskId}`).pipe(
    switchMap(task => {
      if (currentUser.role !== 'Admin' && task.userId !== currentUser.id) {
        return throwError(() => new Error('No tienes permisos para modificar esta tarea'));
      }
      
      return this.http.patch<Task>(
        `${this.API_URL}/tasks/${taskId}`,
        { state: newState },
        { headers: this.headers }
      );
    })
  );
}

// Actualizar una tarea
updateTask(taskId: number, taskData: Partial<Omit<Task, 'id' | 'userId'>>): Observable<Task> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser) {
    return throwError(() => new Error('Usuario no autenticado'));
  }

  // Verificamos que el usuario tenga permiso para actualizar esta tarea
  return this.http.get<Task>(`${this.API_URL}/tasks/${taskId}`).pipe(
    switchMap(task => {
      if (currentUser.role !== 'Admin' && task.userId !== currentUser.id) {
        return throwError(() => new Error('No tienes permisos para modificar esta tarea'));
      }
      
      return this.http.patch<Task>(
        `${this.API_URL}/tasks/${taskId}`,
        taskData,
        { headers: this.headers }
      );
    })
  );
}

// Eliminar una tarea (solo Admin)
deleteTask(taskId: number): Observable<void> {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'Admin') {
    return throwError(() => new Error('No tienes permisos para eliminar tareas'));
  }

  return this.http.delete<void>(
    `${this.API_URL}/tasks/${taskId}`,
    { headers: this.headers }
  );
}
}