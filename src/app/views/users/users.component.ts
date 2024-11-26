import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TableComponent } from '../../components/table/table/table.component';
import { UserCardComponent } from '../../components/cards/user-card/user-card.component';
import { TaskService } from '../../services/tasks/tasks.service';
import { UserService } from '../../services/users/users.service';
import { userPriv } from '../../interfaces/user';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserDialogComponent } from '../../components/dialog/user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../interfaces/task';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, TableComponent, UserCardComponent, MatPaginatorModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  public columns: Array<string> = ['id', 'Nombre', 'Email', 'Rol'];
  public dataKeys: Array<string> = ['id', 'Name', 'Email', 'Role'];
  usersData$ = new BehaviorSubject<userPriv[]>([]);
  public usersData: userPriv[] = [];
  private unassignedTasks: Task[] = [];

  searchControl = new FormControl('');
  filteredUsersData: userPriv[] = [];
  searchTerm: string = '';


  pageSize = 5; // Cantidad de elementos por página
  pageIndex = 0;
  pageSizeOptions = [5, 10]; // Opciones de tamaño de página


  constructor(private _userService: UserService, private _taskService:TaskService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this._userService.getAllUsers().subscribe({
      next: res => {
        this.usersData = res;
        this.filteredUsersData = this.usersData;
        this.usersData$.next(this.usersData);
      },
      error: e => {
        console.log(e);
      }
    });

    this._taskService.getUnassignedTasks().subscribe({
      next: res => {        
        this.unassignedTasks = res;
      },
      error: e => {
        console.log(e);
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de dejar de escribir
      distinctUntilChanged() // Solo emitir si el valor cambió
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm || '');
    });

  }


  onDetails(event: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        title: 'Tareas Asignadas',
        actionButtonLabel: 'Aceptar',
        showCancelButton: false,  
        user: event,      
        action: 'show'
      }
    });
  }

  onEdit(event: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        title: 'Editar usuario',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,
        user: event,
        action: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.user) {
        this._userService.updateUser(event.id, result.user).subscribe({
          next: res => {
            this.ngOnInit();
          },
          error: e => {
            console.log(e)
          }
        })
      }
    });
  }

  onAssignTask(event: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        title: 'Asignar Tarea',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,
        tasks: this.unassignedTasks,
        action: 'assign'
      }
    });

    dialogRef.afterClosed().subscribe(result => {      
      if (result?.assignedTask) {               
        this._taskService.assignTask(result.assignedTask, event.id).subscribe({
          next: res => {
            this.ngOnInit();
          },
          error: e => {
            console.log(e)
          }
        })
      }
    });
  }

  onDelete(event: any) {
     const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar usuario',
        actionButtonLabel: 'Aceptar',
        showCancelButton: true,        
        action: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {      
      if (result) {               
        this._userService.deleteUser(event.id).subscribe({
          next: res => {
            this.ngOnInit();
          },
          error: e => {
            console.log(e);
          }
        })
      }
    });
  }

  getPaginatedUsers(): userPriv[] {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredUsersData.slice(startIndex, endIndex);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  applyFilter(searchTerm: string) {
    const term = searchTerm.trim().toLowerCase();   
      this.filteredUsersData = this.usersData.filter(user => 
        Object.values(user).some(value => 
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
