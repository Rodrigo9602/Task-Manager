import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { BasicCardComponent } from '../basic-card/basic-card.component';
import { userPriv } from '../../../interfaces/user';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, BasicCardComponent],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() userData!: userPriv;

  @Output() editItem = new EventEmitter<userPriv>();
  @Output() deleteItem = new EventEmitter<userPriv>();
  @Output() assignTask = new EventEmitter<userPriv>();
  @Output() viewItem = new EventEmitter<userPriv>();

  public actions = [
    { icon: 'visibility', label: 'Ver detalles', action: 'view' },
    { icon: 'edit', label: 'Editar', action: 'edit' },
    { icon: 'assignment', label: 'Asignar tarea', action: 'assign' },
    { icon: 'delete', label: 'Eliminar', action: 'delete' }
  ];

  handleAction(action: string, element: userPriv) {
    switch (action) {
      case 'view':
        this.viewItem.emit(element);
        break;
      case 'edit':
        this.editItem.emit(element);
        break;
      case 'delete':
        this.deleteItem.emit(element);
        break;
      case 'assign':
        this.assignTask.emit(element as userPriv);
        break;
    }
  }
}
