import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table/table.component';
import { TaskCardComponent } from '../../components/cards/task-card/task-card.component';
import { TaskService } from '../../services/tasks/tasks.service';
import { Task } from '../../interfaces/task';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TableComponent, TaskCardComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  public columns:Array<string> = ['id', 'Nombre', 'Descripción', 'Fecha Inicio', 'Fecha Límite', 'Estado'];
  public dataKeys:Array<string> = ['id', 'name', 'description', 'start_date', 'end_date', 'state'];
  tasksData$ = new BehaviorSubject<Task[]>([]);
  public tasksData:Task[] = [];
  constructor(private _taskService: TaskService) {}

  ngOnInit(): void {
    this._taskService.getTasks().subscribe({
      next: res => {        
        this.tasksData = res;        
        this.tasksData$.next(this.tasksData);
      },
      error: e => {
        console.log(e);
      }
    })
  }

  onDetails(event: any) {
    console.log(event)
  }
  onEdit(event: any) {
    console.log(event)
  }
  onUsersDetails(event: any) {
    console.log(event)
  }
  onDelete(event: any) {
    console.log(event)
  }
}
