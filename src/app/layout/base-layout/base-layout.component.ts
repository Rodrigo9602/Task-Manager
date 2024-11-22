import { Component, computed, Signal } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ThemeService } from '../../services/mode/mode.service';

import { NavItems } from '../../interfaces/nav-items';


@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})
export class BaseLayoutComponent {
  public isDarkMode = computed(() => this._themeService.isDarkMode());
  
  public NavItemsArray: Signal<Array<NavItems>> = computed(() => [        
  ]);
  constructor(private _themeService: ThemeService) {}
}
