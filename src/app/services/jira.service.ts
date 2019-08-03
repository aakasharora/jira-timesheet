import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { SettingService } from '../setting/setting.service';
import { IJiraIssueField } from '../models/jira/jira-models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JiraService {
    constructor(private http: HttpClient, private setting: SettingService) { }

    private getUrl(query) {
        return this.setting.jiraUrl + "/rest/api/2/" + query;
    };
    getIssues(jql: string): Observable<IJiraIssueField> {
        const headers = new HttpHeaders()
            .set("cache", "true");
        return this.http.get<IJiraIssueField>(
            this.getUrl("search?jql=" + jql),
            {
                headers: headers
            });
    }

    isValidUrl(url: string): Observable<any> {
        const headers = new HttpHeaders()
            .set("cache", "true");
        return this.http
            .get(url, {
                headers: headers
            })
    }
}