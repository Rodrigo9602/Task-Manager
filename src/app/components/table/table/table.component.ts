import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { userPriv } from '../../../interfaces/user';
import { Task } from '../../../interfaces/task';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() columns: string[] = [];
  @Input() dataInput: Observable<userPriv[] | Task[]> | undefined;
  public data: userPriv[] | Task[] = [];

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<userPriv | Task>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<userPriv | Task>([]);
  }

  ngOnInit() {
    // Configurar las columnas que se mostrarán
    this.displayedColumns = this.columns.map(col => col.toLowerCase().replace(/ /g, '_'));

    this.dataInput?.subscribe(items => {
      this.data = items;
      // Configurar los datos
      this.dataSource = new MatTableDataSource<userPriv | Task>(this.data);      
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Método para filtrar los datos de la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}