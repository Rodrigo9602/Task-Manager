import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { BasicCardComponent } from '../basic-card/basic-card.component';
import { Task } from '../../../interfaces/task';
import { DatePipe } from '@angular/common';
import { StateColorDirective } from '../../../directives/state-color.directive';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, DatePipe, StateColorDirective, BasicCardComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() taskData!: Task;

  @Output() editItem = new EventEmitter<Task>();
  @Output() deleteItem = new EventEmitter<Task>();
  @Output() viewItem = new EventEmitter<Task>();
  @Output() viewUserDetails = new EventEmitter<Task>();

  public actions = [
    { icon: 'visibility', label: 'Ver detalles', action: 'view' },
    { icon: 'edit', label: 'Editar', action: 'edit' },
    { icon: 'person', label: 'Ver usuario asignado', action: 'view-user' },
    { icon: 'delete', label: 'Eliminar', action: 'delete' }
  ];

  handleAction(action: string, element: Task) {
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
      case 'view-user':
        this.viewUserDetails.emit(element as Task);
        break;      
    }
  }
}
