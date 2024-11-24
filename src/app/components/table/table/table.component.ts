// table.component.ts
import { AfterViewInit, Component, Input, OnInit, ViewChild, Output, EventEmitter, Signal, computed } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { userPriv } from '../../../interfaces/user';
import { Task } from '../../../interfaces/task';
import { Observable } from 'rxjs';
import { FormatDataPipe } from '../../../pipes/format-data.pipe';
import { SanitazerPipe } from '../../../pipes/sanitazer.pipe';

import { actionIcon } from '../../../../../public/icons/icon';
import { ThemeService } from '../../../services/mode/mode.service';

interface TableAction {
  icon: string;
  label: string;
  action: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    SanitazerPipe,
    FormatDataPipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterViewInit {
  private isDarkMode = computed(() => this._themeService.isDarkMode());
  public ActionIcon: Signal<string> = computed(() => this.isDarkMode() ? actionIcon('#ffffff') : actionIcon('#000000'));

  @Input() columns: string[] = [];
  @Input() dataKeys: string[] = [];
  @Input() dataInput: Observable<userPriv[] | Task[]> | undefined;
  @Input() dataType: 'user' | 'task' = 'task';

  @Output() editItem = new EventEmitter<userPriv | Task>();
  @Output() deleteItem = new EventEmitter<userPriv | Task>();
  @Output() assignTask = new EventEmitter<userPriv>();
  @Output() viewUserDetails = new EventEmitter<Task>();
  @Output() viewItem = new EventEmitter<userPriv | Task>();

  public data: userPriv[] | Task[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<userPriv | Task>;
  actions: TableAction[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _themeService: ThemeService) {
    this.dataSource = new MatTableDataSource<userPriv | Task>([]);
  }

  ngOnInit() {
    // Configurar las acciones según el tipo de datos
    this.setupActions();

    // Añadir la columna de acciones a las columnas mostradas
    this.displayedColumns = [...this.dataKeys.map(col => col.toLowerCase().replace(/ /g, '_')), 'actions'];

    this.dataInput?.subscribe(items => {
      this.data = items;
      this.dataSource = new MatTableDataSource<userPriv | Task>(this.data);
    });
  }

  private setupActions() {
    if (this.dataType === 'user') {
      this.actions = [
        { icon: 'visibility', label: 'Ver detalles', action: 'view' },
        { icon: 'edit', label: 'Editar', action: 'edit' },
        { icon: 'assignment', label: 'Asignar tarea', action: 'assign' },
        { icon: 'delete', label: 'Eliminar', action: 'delete' }
      ];
    } else {
      this.actions = [
        { icon: 'visibility', label: 'Ver detalles', action: 'view' },
        { icon: 'edit', label: 'Editar', action: 'edit' },
        { icon: 'person', label: 'Ver usuario asignado', action: 'view-user' },
        { icon: 'delete', label: 'Eliminar', action: 'delete' }
      ];
    }
  }

  handleAction(action: string, element: userPriv | Task) {
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
        if (this.dataType === 'user') {
          this.assignTask.emit(element as userPriv);
        }
        break;
      case 'view-user':
        if (this.dataType === 'task') {
          this.viewUserDetails.emit(element as Task);
        }
        break;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}