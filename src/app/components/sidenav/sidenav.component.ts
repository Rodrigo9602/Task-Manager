import { Component, computed, Input, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavService } from '../../services/sidenav/sidenav.service';
import { NavItems } from '../../interfaces/nav-items';
import { SanitazerPipe } from '../../pipes/sanitazer.pipe';


@Component({
  selector: 'tasks-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, SanitazerPipe],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent  implements OnInit{
  @Input() sidenavTitle:string = '';
  @Input() NavItems: Signal<Array<NavItems>> = computed(() => []);
  @Input() opened:Signal<boolean> = computed(()=>false); // El sidenav está cerrado por defecto  

  constructor(private _sidenavService:SidenavService) {}
  ngOnInit(): void {
    this.opened = computed(()=>this._sidenavService.sideNavState());
  }

  onNavigate() {        
    this._sidenavService.toggleSideNav(false);
  }  
}
