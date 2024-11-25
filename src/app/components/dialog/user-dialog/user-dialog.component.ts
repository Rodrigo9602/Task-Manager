import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/security/security.service';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DialogComponent, DialogData } from '../dialog.component';
import { UserService } from '../../../services/users/users.service';
import { User } from '../../../interfaces/user';


@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [DialogComponent, MatDialogModule, CommonModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit {
  dialogData!: DialogData;
  public user!: User;
  public users: User[] = [];
  userEditForm!: FormGroup;

  constructor(
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
    this.userEditForm = this.fb.group({
      id: [this.data.user.id],
      name: [this.data.user.name, [Validators.required, Validators.minLength(3)]],
      role: [this.data.user.role, Validators.required]
    });
  }

  onAccept(): void {
    let result: any = {
      action: this.data.action
    };


    switch (this.data.action) {
      case 'assign':

        break;
      case 'edit':
        result.userData = this.userEditForm.value;
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
