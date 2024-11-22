import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/security/security.service';
import { SanitazerPipe } from '../../../pipes/sanitazer.pipe';
import { eyeOpen, eyeClose, appLogo, emailIcon, lockIcon } from '../../../../../public/icons/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, SanitazerPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public appIcon:string = appLogo(24);
  public emailIcon:string = emailIcon(20);
  public passwordIcon:string = lockIcon(20);
  public showIcon:string = eyeOpen(22);
  public date: String = new Date().toDateString();
  public showPassword:Boolean = false;
  public loginForm = new FormGroup({    
    userEmail: new FormControl('', Validators.email),
    userPassword: new FormControl('', Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/)),    
  });

  constructor(private _authService: AuthService, private _router:Router) {}

  ngOnInit(): void {
    localStorage.clear();
  }

  onShowPassword():void {
    this.showPassword = !this.showPassword;
    this.showPassword ? this.showIcon = eyeClose(22) : this.showIcon = eyeOpen(22);
  }

  onSubmit():void {
    console.log(this.loginForm.value)
    this._authService.login(this.loginForm.value.userEmail!, this.loginForm.value.userPassword!).subscribe({
      next: res => {
        this._router.navigate(['/tasks'])
      },
      error: e => { console.log(e) }
    });
  }
}
