// state-color.directive.ts
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

export type StateType = 'Pendiente' | 'En Proceso' | 'Completada';

@Directive({
  selector: '[appStateColor]',
  standalone: true
})
export class StateColorDirective implements OnInit {
  @Input() appStateColor: StateType = 'Pendiente';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setColor();
  }

  private setColor() {
    switch (this.appStateColor) {
      case 'Pendiente':
        this.el.nativeElement.style.color = '#e0e31c';
        break;
      case 'En Proceso':
        this.el.nativeElement.style.color = '#49a3e7';
        break;
      case 'Completada':
        this.el.nativeElement.style.color = '#3adf34';
        break;
      default:
        this.el.nativeElement.style.color = 'black';
    }
  }
}