import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table/table.component';
import { UserService } from '../../services/users/users.service';
import { userPriv } from '../../interfaces/user';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  public columns:Array<string> = ['id', 'Name', 'Email', 'Role'];
  usersData$ = new BehaviorSubject<userPriv[]>([]);
  public usersData:userPriv[] = [];
  constructor(private _userService:UserService) {}
  
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
}
