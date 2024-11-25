import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/users/users.service';
import { TableComponent } from '../../components/table/table/table.component';
import { TaskCardComponent } from '../../components/cards/task-card/task-card.component';
import { TaskDialogComponent } from '../../components/dialog/task-dialog/task-dialog.component';
import { TaskService } from '../../services/tasks/tasks.service';
import { Task } from '../../interfaces/task';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TableComponent, TaskCardComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  public columns: Array<string> = ['id', 'Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Límite', 'Estado'];
  public dataKeys: Array<string> = ['id', 'name', 'description', 'start_date', 'end_date', 'state'];
  tasksData$ = new BehaviorSubject<Task[]>([]);
  public tasksData: Task[] = [];
  private users: User[] = [];

  constructor(private _taskService: TaskService, private dialog: MatDialog, private _userService: UserService) { }

  ngOnInit(): void {
    this._taskService.getTasks().subscribe({
      next: res => {
        this.tasksData = res;
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
      if (result) {          
           this._taskService.createTask(result.taskData, result.taskData.userId).subscribe({
          next: () => {            
            // Actualizar la lista de tareas y mostrar mensaje de éxito
            this.ngOnInit();
          },
          error: (e) => console.error(e)
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
    console.log(event)
  }

  onAssign(event: any) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        title: 'Asignar tarea',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,
        users: this.users,
        taskId: event.id,
        action: 'assign'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.userId) {        
        this._taskService.assignTask(result.taskId, result.userId).subscribe({
          next: () => {
            // Actualizar la lista de tareas y mostrar mensaje de éxito
            this.ngOnInit();
          },
          error: (e) => console.error(e)
        });
      }
    });
  }

  onDelete(event: any) {
    console.log(event)
  }
}
