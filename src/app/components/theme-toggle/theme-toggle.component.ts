import { Component } from '@angular/core';
import { ThemeService } from '../../services/mode/mode.service';
import { SanitazerPipe } from '../../pipes/sanitazer.pipe';

import { lightIcon, darkIcon } from '../../../../public/icons/icon';

@Component({
  selector: 'base-theme-toggle',
  standalone: true,
  imports: [SanitazerPipe],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  constructor(public _themeService: ThemeService){ }
  public lightIcon = lightIcon;
  public darkIcon = darkIcon;

  toggleTheme():void {
    this._themeService.toggleTheme();
  }

  getIcon() {
    return this._themeService.isDarkMode() ? this.lightIcon : this.darkIcon;
  }
}
