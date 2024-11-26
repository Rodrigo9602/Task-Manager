import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table/table.component';
import { UserCardComponent } from '../../components/cards/user-card/user-card.component';
import { UserService } from '../../services/users/users.service';
import { userPriv } from '../../interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { UserDialogComponent } from '../../components/dialog/user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableComponent, UserCardComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  public columns: Array<string> = ['id', 'Nombre', 'Email', 'Rol'];
  public dataKeys: Array<string> = ['id', 'Name', 'Email', 'Role'];
  usersData$ = new BehaviorSubject<userPriv[]>([]);
  public usersData: userPriv[] = [];
  constructor(private _userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this._userService.getAllUsers().subscribe({
      next: res => {
        this.usersData = res;
        this.usersData$.next(this.usersData);
      },
      error: e => {
        console.log(e);
      }
    })
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
    console.log(event)
  }
  onAssignTask(event: any) {
    console.log(event)
  }
  onDelete(event: any) {
    console.log(event)
  }
}
