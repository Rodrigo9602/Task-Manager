import { Component, computed, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavService } from '../../../services/sidenav/sidenav.service';

@Component({
  selector: 'menu-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss'
})
export class MenuButtonComponent implements OnInit{
  public opened:Signal<boolean> = computed(()=> false);
  
  constructor(private _sidenavService: SidenavService) {}

  ngOnInit(): void {
    this.opened = computed(() => this._sidenavService.sideNavState());
  }
  
  onHandleSideNav() {
    this._sidenavService.toggleSideNav(!this.opened());    
  }
}
