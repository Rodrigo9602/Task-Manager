import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/security/security.service';
import { SanitazerPipe } from '../../../pipes/sanitazer.pipe';
import { userIcon, eyeOpen, eyeClose, appLogo, emailIcon, lockIcon } from '../../../../../public/icons/icon';
import { userReg } from '../../../interfaces/user';
import { Toast } from '../../../components/alert/alert';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    SanitazerPipe,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  public userIcon: string = userIcon('#000000', 20);
  public appIcon: string = appLogo(24);
  public emailIcon: string = emailIcon(20);
  public passwordIcon: string = lockIcon(20);
  public showIcon: string = eyeOpen('#000000', 22);
  public date: String = new Date().toDateString();
  public showPassword: Boolean = false;
  public registerForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9áéíóúñ\s]*$/)
    ]),
    userEmail: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/)
    ]),
  });

  private user: userReg = {
    email: '',
    name: '',
    password: '',
    role: 'User',
  };

  constructor(private _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
    localStorage.clear();
  }

  onShowPassword(): void {
    this.showPassword = !this.showPassword;
    this.showIcon = this.showPassword
      ? eyeClose('#000000', 22)
      : eyeOpen('#000000', 22);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.user.name = this.registerForm.value.userName!;
      this.user.email = this.registerForm.value.userEmail!;
      this.user.password = this.registerForm.value.userPassword!;

      this._authService.register(this.user).subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: 'Usuario registrado'
          });
          this._router.navigate(['/tasks']);
        },
        error: e => {
          Toast.fire({
            icon: 'error',
            title: e.message
          });
        }
      });
    }
  }

  // Getters for easy access in template
  get userNameControl() { return this.registerForm.get('userName'); }
  get emailControl() { return this.registerForm.get('userEmail'); }
  get passwordControl() { return this.registerForm.get('userPassword'); }
}