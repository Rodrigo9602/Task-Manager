import { Component, computed, Signal } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { ThemeService } from '../../services/mode/mode.service';

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
export class BaseLayoutComponent {
  public isDarkMode = computed(() => this._themeService.isDarkMode());
  ;
  public NavItemsArray: Signal<Array<NavItems>> = computed(() => [  
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

  constructor(private _themeService: ThemeService) {}  
}
