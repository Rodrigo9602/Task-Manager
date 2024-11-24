import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table/table.component';
import { TaskService } from '../../services/tasks/tasks.service';
import { Task } from '../../interfaces/task';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  public columns:Array<string> = ['id', 'Name', 'Description', 'Start_date', 'End_date', 'State'];
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
}
