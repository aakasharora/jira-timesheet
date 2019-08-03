import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingService } from './setting.service';
import { RoutePath } from '../enums/router-path';
import { JiraService } from '../services/jira.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControlTyped } from '../models/form-controls/form-control-typed';

enum SettingError {
  Login = "You must login in your jira account to access your timesheet.",
  NotFound = "You can't view this project. It may have been deleted or you don't have permission to view it.",
  Unknown = "Could not validate. Make sure you're connected to internet, enter correct information and try again."
}
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
  settingForm: SettingFormGroup;
  show = {
    loader: false
  }
  validated = false;
  errorMessage: SettingError;

  constructor(private router: Router,
    private settingService: SettingService,
    private jiraService: JiraService) {
    this.settingForm = new SettingFormGroup(
      settingService.jiraUrl || "",
      settingService.projectKey || "");
  }

  viewTimesheet() {
    if (this.settingForm.valid) {
      this.save();
      this.show.loader = true;
      this.validated = false;
      const url = `${this.settingService.jiraUrl}/browse/${this.settingService.projectKey}-1`;
      this.jiraService
        .isValidUrl(url)
        .toPromise()
        .then(() => {
          this.onValidationSuccess();
        }).catch((reason: HttpErrorResponse) => {
          if (reason.status === 200 && reason.url === url) {
            this.onValidationSuccess();
          } else {
            this.handleError(reason);
          }
          this.validated = true;
        }).finally(() => {
          this.show.loader = false;
        });
    }
  }

  private onValidationSuccess() {
    this.settingService.isUrlValidated = true;
    this.router.navigate(['/', RoutePath.Timesheet]);
  }

  private save() {
    const setting = this.settingForm.getRawValue();
    this.settingService.jiraUrl = setting[SettingFormGroupControl.JiraUrl];
    this.settingService.projectKey = setting[SettingFormGroupControl.ProjectKey];
  }

  private handleError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 200:
        window.open(error.url);
        this.errorMessage = SettingError.Login;
        break;
      case 404:
        this.errorMessage = SettingError.NotFound;
        break;
      default:
        this.errorMessage = SettingError.Unknown;
        break;
    }
  }
}

class SettingFormGroup extends FormGroup {
  constructor(jiraUrl: string, projectKey: string) {
    const urlControl = new FormControlTyped<string>(jiraUrl);
    urlControl.setValidators(Validators.required);
    const keyControl = new FormControlTyped<string>(projectKey);
    keyControl.setValidators(Validators.required);

    super({
      [SettingFormGroupControl.JiraUrl]: urlControl,
      [SettingFormGroupControl.ProjectKey]: keyControl
    });
  }

  public getRawValue(): SettingFormValue {
    return super.getRawValue();
  }
}

enum SettingFormGroupControl {
  JiraUrl = "jiraUrl",
  ProjectKey = "projectKey"
}

interface SettingFormValue {
  [SettingFormGroupControl.JiraUrl]: string,
  [SettingFormGroupControl.ProjectKey]: string
}