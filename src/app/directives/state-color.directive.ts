import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { StateType } from '../interfaces/task';

@Directive({
  selector: '[appStateColor]',
  standalone: true
})
export class StateColorDirective implements OnInit, OnChanges {
  @Input() appStateColor: StateType = 'Pendiente';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setColor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appStateColor']) {
      this.setColor();
    }
  }

  private setColor() {
    let color: string;
    switch (this.appStateColor) {
      case 'Pendiente':
        color = '#e0e31c';
        break;
      case 'En Proceso':
        color = '#49a3e7';
        break;
      case 'Completada':
        color = '#3adf34';
        break;
      default:
        color = 'black';
    }
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
  }
}