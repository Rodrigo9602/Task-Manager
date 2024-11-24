import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatData',
  standalone: true
})
export class FormatDataPipe implements PipeTransform {
  transform(value: any): any {
    // Si es un número, retornarlo sin cambios
    if (typeof value === 'number') {
      return value;
    }

    // Si es string, verificar si es una fecha ISO válida
    if (typeof value === 'string') {
      // Patrón para detectar strings que parecen fechas ISO
      const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      
      if (!isoDatePattern.test(value)) {
        return value; // Retorna el string original si no parece una fecha ISO
      }

      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    }

    // Para cualquier otro tipo de valor, retornarlo sin cambios
    return value;
  }
}