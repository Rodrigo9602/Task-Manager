import { Injectable, signal, computed, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sideNavState$ = signal<boolean>(false);
  public sideNavState: Signal<boolean> = computed(() => this.sideNavState$());

  toggleSideNav(state:boolean) {
    this.sideNavState$.set(state);
  }
}
