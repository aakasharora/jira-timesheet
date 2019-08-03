import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../enums/local-storage-key.enum';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    private _jiraUrl: string;
    public get jiraUrl(): string {
        return this._jiraUrl
            || window.localStorage.getItem(LocalStorageKey.JiraUrl);
    }
    public set jiraUrl(value: string) {
        this._jiraUrl = value;
        this.isUrlValidated = false;
        window.localStorage.setItem(LocalStorageKey.JiraUrl, value);
    }
    private _projectKey: string;
    public get projectKey(): string {
        return this._projectKey
            || window.localStorage.getItem(LocalStorageKey.ProjectKey);
    }
    public set projectKey(value: string) {
        this._projectKey = value;
        window.localStorage.setItem(LocalStorageKey.ProjectKey, value);
    }
    private _isUrlValidated: boolean;
    public get isUrlValidated(): boolean {
        return this._isUrlValidated
            || JSON.parse(window.localStorage.getItem(LocalStorageKey.IsUrlValidated)) as boolean;
    }
    public set isUrlValidated(value: boolean) {
        this._isUrlValidated = value;
        window.localStorage.setItem(LocalStorageKey.IsUrlValidated, `${value}`);
    }
}