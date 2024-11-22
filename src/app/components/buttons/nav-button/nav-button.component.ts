import { Component, Input } from '@angular/core';
import { NavItems } from '../../../interfaces/nav-items';
import { SanitazerPipe } from '../../../pipes/sanitazer.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-button',
  standalone: true,
  imports: [SanitazerPipe],
  templateUrl: './nav-button.component.html',
  styleUrl: './nav-button.component.scss'
})
export class NavButtonComponent {
  @Input() buttonContent!:NavItems;

  constructor(private _router:Router) { }

  getIcon():string {
    return this.buttonContent.icon;
  }

  navigate(): void {
    this._router.navigate([this.buttonContent.link]);
  }
}
