import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface ITableColumn<T> {
  index: number,
  rows: T[],
  clickable: boolean
}

export class TableColumn<T> implements ITableColumn<T> {
  index: number;
  rows: T[];
  clickable: boolean;
  constructor(column: ITableColumn<T>) {
    this.index = column.index;
    this.clickable = column.clickable;
    this.rows = column.rows;
  }
}

export interface ITable {
  data: {
    columns: {
      [column: string]: ITableColumn<string | number>
    }
  }
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {
  @Input() dataSource: ITable;

  columns: string[];
  rows: (string | number)[][];


  get columnsObject() {
    return this.dataSource.data.columns;
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["dataSource"]) {
      this.renderTable(this.dataSource);
    }
  }

  private renderTable(dataSource: ITable) {
    if (dataSource && dataSource.data && this.columnsObject) {
      this.columns = Object.keys(this.columnsObject).sort((a, b) => {
        return this.columnsObject[a].index - this.columnsObject[b].index;
      });
    }
    if (this.columns && this.columns.length > 0) {
      let column = this.columns[0];
      this.rows = new Array(this.columnsObject[column].rows.length);
      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        this.rows[rowIndex] = new Array(this.columns.length);
        for (let columnIndex = 0; columnIndex < this.columns.length; columnIndex++) {
          column = this.columns[columnIndex];
          this.rows[rowIndex][columnIndex] = this.columnsObject[column].rows[rowIndex];
        }
      }
    }
  }

  onCellClick(row: any[], columnIndex: number): void {
    console.log(row, columnIndex);
  }

}
