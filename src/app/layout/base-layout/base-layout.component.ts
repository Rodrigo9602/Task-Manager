import { Component, computed, OnInit, Signal } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { ThemeService } from '../../services/mode/mode.service';
import { AuthService } from '../../services/security/security.service';
import { NavItems } from '../../interfaces/nav-items';
import { RouterOutlet } from '@angular/router';
import { userIcon, taskIcon } from '../../../../public/icons/icon';


@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [NavbarComponent, SidenavComponent, RouterOutlet],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})
export class BaseLayoutComponent implements OnInit{
  public isDarkMode = computed(() => this._themeService.isDarkMode());
  public NavItemsArray: Signal<Array<NavItems>> = computed(() => []);  

  constructor(private _themeService: ThemeService, private _authService:AuthService) {}  

  ngOnInit(): void {    
    const adminRoutes = computed(() => [
      {
        name: 'Usuarios', 
        link: '/users', 
        icon: this.isDarkMode() ? userIcon('#ffffff', 24) : userIcon('#000000', 24)
      },
      {
        name: 'Tareas', 
        link: '/tasks', 
        icon: this.isDarkMode() ? taskIcon('#ffffff', 24) : taskIcon('#000000', 24)
      } 
    ]);
    const userRoutes = computed(() => [        
      {
        name: 'Tareas', 
        link: '/tasks', 
        icon: this.isDarkMode() ? taskIcon('#ffffff', 24) : taskIcon('#000000', 24)
      } 
     ]);

   this.NavItemsArray = computed(() => this._authService.isAdmin() ? adminRoutes() : userRoutes());    
  }
}
