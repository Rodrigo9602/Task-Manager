import { Component, computed, Input, OnInit, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { SanitazerPipe } from '../../pipes/sanitazer.pipe';

import { NavItems } from '../../interfaces/nav-items';
import { logoutIcon } from '../../../../public/icons/icon';
import { ThemeService } from '../../services/mode/mode.service';
import { AuthService } from '../../services/security/security.service';
import { Router } from '@angular/router';


@Component({
  selector: 'task-navbar',
  standalone: true,
  imports: [RouterModule, SanitazerPipe, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  @Input() NavHeader: String = '';
  @Input() NavItems: Signal<Array<NavItems>> = computed(() => []);
  public isDarkMode = computed(() => this._themeService.isDarkMode());
  public LogOutIcon = computed(()=>'');

  constructor(private _themeService: ThemeService, private _authService:AuthService, private _router:Router) {}

  ngOnInit(): void {
    this.LogOutIcon = computed(()=>{return this.isDarkMode() ? logoutIcon('#ffffff', 30) : logoutIcon('#000000', 30)});
  }

  logout():void {
    this._authService.logout();
    this._router.navigate(['/']);
  }
}
