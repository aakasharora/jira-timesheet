import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SettingService } from 'src/app/setting/setting.service';
import { RoutePath } from 'src/app/enums/router-path';

/**
 * Check if the jira url and project key exists
 *  If yes, then 
 *      Check if the user is loggen in 
 *          If yes, then return true
 *          If no, then navigate to login route
 *  If no, then navigate to setting route
 */
@Injectable({
    providedIn: 'root'
})
export class CanTimesheetActivate implements CanActivate {
    constructor(private setting: SettingService,
        private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.setting
            && this.setting.jiraUrl
            && this.setting.projectKey
            && this.setting.isUrlValidated) {
            return true;
        } else {
            this.router.navigate(['/', RoutePath.Setting]);
        }
    }
}