import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/security/security.service';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { StateColorDirective } from '../../../directives/state-color.directive';
import { DialogComponent, DialogData } from '../dialog.component';
import { UserService } from '../../../services/users/users.service';
import { User } from '../../../interfaces/user';
import { TaskService } from '../../../services/tasks/tasks.service';
import { Task } from '../../../interfaces/task';


@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [DialogComponent, MatDialogModule, CommonModule, MatSelectModule, MatInputModule, ReactiveFormsModule, DatePipe, StateColorDirective],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit {
  dialogData!: DialogData;
  public user!: User;
  userEditForm!: FormGroup;
  public tasks: Task[] = [];
  public taskSelected = new FormControl(null);

  constructor(
    private _taskService: TaskService,
    private _userService: UserService,
    private _authService: AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogData = {
      title: data.title,
      showCancelButton: data.showCancelButton,
      actionButtonLabel: data.actionButtonLabel
    };
  }

  ngOnInit(): void {
    if (this.data.action === 'edit') {
      this.userEditForm = this.fb.group({        
        email: [this.data.user.email, Validators.email],        
        name: [this.data.user.name, [Validators.required, Validators.minLength(3)]],
        role: [this.data.user.role, Validators.required]
      });
    }


    if (this.data.action === 'show') {
      this._taskService.getUserTasks(this.data.user.id).subscribe({
        next: res => {
          this.tasks = res;
        },
        error: e => {
          console.log(e);
        }
      })
    }
  }

  onAccept(): void {
    let result: any = {
      action: this.data.action
    };


    switch (this.data.action) {
      case 'assign':
        if(this.taskSelected.value) {
          result.assignedTask = this.taskSelected.value;
        }       
        break;
      case 'edit':
        result.user = this.userEditForm.value;
        break;      
      case 'delete':
        result = true;
        break;
    }

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
