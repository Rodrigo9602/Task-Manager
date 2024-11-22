import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitazer',
  standalone: true
})
export class SanitazerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(value: string) {    
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
