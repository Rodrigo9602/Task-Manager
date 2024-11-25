import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/security/security.service';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StateColorDirective } from '../../../directives/state-color.directive';
import { DatePipe } from '@angular/common';
import { DialogComponent, DialogData } from '../dialog.component';
import { UserService } from '../../../services/users/users.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [DialogComponent, MatDialogModule, CommonModule, MatSelectModule, MatDatepickerModule, MatInputModule, ReactiveFormsModule, DatePipe, StateColorDirective],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent implements OnInit {
  dialogData!: DialogData;
  public user!: User;
  public users: User[] = [];
  selectedUser = new FormControl('');
  taskForm!: FormGroup;

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogData = {
      title: data.title,
      showCancelButton: data.showCancelButton,
      actionButtonLabel: data.actionButtonLabel
    };
  }

  ngOnInit(): void {

    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      state: ['Pendiente', Validators.required],
      userId: [''],
    });
    
    if (this.data.action === 'show' && this.data.task.userId) {
      this._userService.getUser(this.data.task.userId).subscribe({
        next: res => {
          this.user = res;
        },
        error: e => { console.log(e) }
      })
    }

    if(this.data.users) {
      if(!this._authService.isAdmin()) {
        this._authService.currentUser$.subscribe(userAuth => {          
          this.users = this.data.users.filter((user:User) => user.id === userAuth?.id);         
        })        
      } else {
        this.users = this.data.users;
      }
    }
  }

  // método para manejar el cierre del diálogo
  onAccept(): void {
    let result: any = {
      action: this.data.action
    };


    switch (this.data.action) {
      case 'assign':
        result.userId = this.selectedUser.value;
        result.taskId = this.data.taskId;
        break;
      case 'add':
        result.taskData = this.taskForm.value;
        break;
    }

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}