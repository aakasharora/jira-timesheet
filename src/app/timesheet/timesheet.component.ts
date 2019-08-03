import { Component, OnInit } from '@angular/core';
import { TimesheetService, AuthorWorkLogHours, WeekDates } from './timesheet.service';
import { ITable } from '../table/table.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RoutePath } from '../enums/router-path';
import { FormControlTyped } from '../models/form-controls/form-control-typed';
import { debounceTime } from "rxjs/operators";
import { AutoUnsubscribeOnDestroy } from '../decorators/auto-unsubscribe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  providers: [TimesheetService]
})
@AutoUnsubscribeOnDestroy()
export class TimesheetComponent implements OnInit {
  timesheet: ITable = {
    data: {
      columns: null
    }
  };
  workLogs: AuthorWorkLogHours;
  loading = false;
  user = new FormControlTyped<string>("");
  user$: Subscription;

  private startDate: Date;
  private get endDate(): Date {
    return this.startDate.add(6);;
  }
  private get weekDates(): WeekDates {
    return this.timesheetService.getWeekDates(this.startDate, this.endDate);
  }
  constructor(private timesheetService: TimesheetService,
    private router: Router) { }

  ngOnInit() {
    this.startDate = new Date().startOfWeek();
    this.timesheetService.getWeekDates(this.startDate, this.endDate);
    this.loadTimeSheet(this.startDate);
    this.user$ = this.user.valueChanges
      .pipe(debounceTime(250))
      .subscribe((value) => {
        this.timesheet = this.timesheetService.getTableData(this.workLogs, this.weekDates, value);
      });
  }

  onSetting(): void {
    this.router.navigate(['/', RoutePath.Setting]);
  }

  updateStartDate(days: number): void {
    this.startDate = this.startDate.add(days);
    this.loadTimeSheet(this.startDate);
  }

  private loadTimeSheet(startDate: Date): void {
    this.loading = true;
    this.timesheetService.getTimeSheet(startDate)
      .then((workLogs: AuthorWorkLogHours) => {
        this.workLogs = workLogs;
        this.timesheet = this.timesheetService.getTableData(this.workLogs, this.weekDates, this.user.value);
      }).catch((reason: HttpErrorResponse) => {
        this.router.navigate(['/', RoutePath.Setting]);
      }).finally(() => {
        this.loading = false;
      });
  }
}
