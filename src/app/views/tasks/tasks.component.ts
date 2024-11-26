import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { UserService } from '../../services/users/users.service';
import { TableComponent } from '../../components/table/table/table.component';
import { TaskCardComponent } from '../../components/cards/task-card/task-card.component';
import { TaskDialogComponent } from '../../components/dialog/task-dialog/task-dialog.component';
import { TaskService } from '../../services/tasks/tasks.service';
import { Task } from '../../interfaces/task';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { User } from '../../interfaces/user';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Toast } from '../../components/alert/alert';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, TableComponent, TaskCardComponent, MatPaginatorModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  public columns: Array<string> = ['id', 'Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Límite', 'Estado'];
  public dataKeys: Array<string> = ['id', 'name', 'description', 'start_date', 'end_date', 'state'];
  tasksData$ = new BehaviorSubject<Task[]>([]);
  public tasksData: Task[] = [];
  private users: User[] = [];

  searchControl = new FormControl('');
  filteredTasksData: Task[] = [];
  searchTerm: string = '';

  pageSize = 5; // Cantidad de elementos por página
  pageIndex = 0;
  pageSizeOptions = [5, 10]; // Opciones de tamaño de página

  constructor(private _taskService: TaskService, private dialog: MatDialog, private _userService: UserService) { }

  ngOnInit(): void {
    this._taskService.getTasks().subscribe({
      next: res => {
        this.tasksData = res;
        this.filteredTasksData = this.tasksData;
        this.tasksData$.next(this.tasksData);
      },
      error: e => {
        console.log(e);
      }
    });

    this._userService.getAllUsers().subscribe({
      next: res => {
        this.users = res;
      },
      error: e => {
        console.log(e)
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de dejar de escribir
      distinctUntilChanged() // Solo emitir si el valor cambió
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm || '');
    });

  }

  onAddTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        title: 'Crear tarea',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,
        users: this.users,
        action: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.taskData) {
        this._taskService.createTask(result.taskData, result.taskData.userId).subscribe({
          next: () => {
            // Actualizar la lista de tareas y mostrar mensaje de éxito
            Toast.fire({
              icon: 'success',
              title: 'Tarea añadida'
            });
            
            this.ngOnInit();
          },
          error: (e) => {
            Toast.fire({
              icon: 'error',
              title: e.message,              
            });
          }
        });
      }
    });
  }

  onDetails(event: any) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        title: 'Detalles de la tarea',
        actionButtonLabel: 'Aceptar',
        showCancelButton: false,
        task: event,
        action: 'show'
      }
    });
  }

  onEdit(event: any) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        title: 'Editar tarea',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,
        task: event,
        action: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.taskData) {
        this._taskService.updateTask(result.taskData.id, result.taskData).subscribe({
          next: () => {
            Toast.fire({
              icon: 'success',
              title: 'Tarea editada'
            });
            this.ngOnInit();
          },
          error: e => {
            Toast.fire({
              icon: 'error',
              title: e.message,              
            });
          }
        })
      }
    });
  }

  onAssign(event: any) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        title: 'Asignar tarea',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,
        selectedUser: event.userId,
        users: this.users,        
        action: 'assign'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.userId) {
        this._taskService.assignTask(event.id, result.userId).subscribe({
          next: () => {
            // Actualizar la lista de tareas y mostrar mensaje de éxito
            Toast.fire({
              icon: 'success',
              title: 'Tarea asignada'
            });
            this.ngOnInit();
          },
          error: (e) => {
            Toast.fire({
              icon: 'error',
              title: e.message,              
            });
          }
        });
      }
    });
  }

  onDelete(event: any) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar tarea',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,        
        action: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._taskService.deleteTask(event.id).subscribe({
          next: () => {
            Toast.fire({
              icon: 'success',
              title: 'Tarea eliminada'
            });            
            this.ngOnInit();
          },
          error: (e) => {
            Toast.fire({
              icon: 'error',
              title: e.message,              
            });
          }
        })
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  getPaginatedTasks(): Task[] {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredTasksData.slice(startIndex, endIndex);
  }

  applyFilter(searchTerm: string) {
    const term = searchTerm.trim().toLowerCase();   
      this.filteredTasksData = this.tasksData.filter(task => 
        Object.values(task).some(value => 
          String(value).toLowerCase().includes(term)
        )
      );
      this.pageIndex = 0; // Resetear página al filtrar        
  }

  onFilterInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.applyFilter(inputElement.value);
  }
}
