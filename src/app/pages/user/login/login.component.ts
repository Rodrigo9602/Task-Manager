import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/security/security.service';
import { SanitazerPipe } from '../../../pipes/sanitazer.pipe';
import { eyeOpen, eyeClose, appLogo, emailIcon, lockIcon } from '../../../../../public/icons/icon';
import { Toast } from '../../../components/alert/alert';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public appIcon: string = appLogo(24);
  public emailIcon: string = emailIcon(20);
  public passwordIcon: string = lockIcon(20);
  public showIcon: string = eyeOpen('#000000', 22);
  public date: String = new Date().toDateString();
  public showPassword: Boolean = false;
  public loginForm = new FormGroup({
    userEmail: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/)
    ]),
  });

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
    if (this.loginForm.valid) {
      this._authService.login(
        this.loginForm.value.userEmail!,
        this.loginForm.value.userPassword!
      ).subscribe({
        next: () => {
          Toast.fire({
            icon: 'success',
            title: 'Sesión iniciada'
          });
          this._router.navigate(['/tasks'])
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
  get emailControl() { return this.loginForm.get('userEmail'); }
  get passwordControl() { return this.loginForm.get('userPassword'); }
}