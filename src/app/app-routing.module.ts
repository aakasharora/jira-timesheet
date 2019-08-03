import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { CanTimesheetActivate } from './timesheet/route-guard/can-timesheet-activate.service';
import { RoutePath } from './enums/router-path';

const routes: Routes = [
    { path: '', redirectTo: RoutePath.Timesheet, pathMatch: 'full' },
    {
        path: RoutePath.Timesheet, component: TimesheetComponent,
        canActivate: [CanTimesheetActivate]
    },
    { path: RoutePath.Setting, component: SettingComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
