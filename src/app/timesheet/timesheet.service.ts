import '../../lib/date-extensions';
import '../extensions/jira-date-extension';
import { Injectable } from '@angular/core';
import { SettingService } from '../setting/setting.service';
import { JiraService } from '../services/jira.service';
import { IJiraWorkLog } from '../models/jira/jira-models';
import { JiraWorkLog } from '../models/jira/jira-work-log';
import { HttpErrorResponse } from '@angular/common/http';
import { ITable, TableColumn } from '../table/table.component';

interface AuthorWorkLogs {
    [authorName: string]: {
        [date: string]: JiraWorkLog[]
    }
}

export interface AuthorWorkLogHours {
    [authorName: string]: {
        [date: string]: string;
    }
}

export interface WeekDates {
    [dateString: string]: string;
}



@Injectable()
export class TimesheetService {
    constructor(public settingService: SettingService,
        private jira: JiraService) { }

    getTimeSheet(startDate: Date, userIdOrKey?: string[]): Promise<AuthorWorkLogHours> {
        const promise = new Promise<AuthorWorkLogHours>((resolve, reject) => {
            const endDate = startDate.add(7);

            let jql = `project=${this.settingService.projectKey}`;
            jql += ` AND updated>='${startDate.toJiraDateString()}'`;
            jql += ` AND updated<='${endDate.toJiraDateString()}'`;
            jql += ` AND timespent>0`;
            if (userIdOrKey && userIdOrKey.length > 0) {
                jql += ` AND "User" in (${userIdOrKey.join(',')})`
            }
            jql += `&fields=worklog,summary&maxResults=1000`;

            const weekDates: WeekDates = this.getWeekDates(startDate, endDate);
            this.jira.getIssues(jql)
                .toPromise()
                .then((data) => {
                    const results = data;
                    let authorWorklogs: AuthorWorkLogs = {};
                    for (let i = 0; i < results.issues.length; i++) {
                        let issue = results.issues[i];
                        let worklogField = issue.fields.worklog;
                        // if (worklogField.total > worklogField.maxResults) {
                        //     issue.fields.worklog = Jira.getWorklogsSync(issue.id);
                        // }
                        this.addWorklogs(issue.fields.worklog.worklogs, authorWorklogs, weekDates);
                    };
                    const authorWorkLogHours = this.mapLogsToHours(authorWorklogs);
                    resolve(authorWorkLogHours);
                }).catch((reason: HttpErrorResponse) => {
                    reject(reason);
                });
        });

        return promise;
    }


    private addWorklogs(worklogsOfIssueToAdd: IJiraWorkLog[], allWorklogs: AuthorWorkLogs, datesFilter: WeekDates) {
        for (let j = 0; j < worklogsOfIssueToAdd.length; j++) {
            let worklog = new JiraWorkLog(worklogsOfIssueToAdd[j]);
            let startedDate = worklog.started.toJiraDateString();

            if (datesFilter[startedDate]) {
                if (allWorklogs[worklog.author.name] === undefined) {
                    allWorklogs[worklog.author.name] = {};
                }


                if (allWorklogs[worklog.author.name][startedDate] === undefined) {
                    allWorklogs[worklog.author.name][startedDate] = [];
                }


                allWorklogs[worklog.author.name][startedDate].push(worklog);
            }
        };
    }

    private getWorkLogHours(workLogs: IJiraWorkLog[]): number {
        if (!workLogs || workLogs.length === 0) {
            return 0;
        }
        return workLogs.reduce((sum, workLog) => sum + (workLog.timeSpentSeconds / 3600), 0);
    }

    private mapLogsToHours(authorWorkLogs: AuthorWorkLogs): AuthorWorkLogHours {
        const authorWorkLogHours: AuthorWorkLogHours = {};
        for (const author in authorWorkLogs) {
            if (authorWorkLogs.hasOwnProperty(author)) {
                const dateWiseLogs = authorWorkLogs[author];
                authorWorkLogHours[author] = {};
                for (const date in dateWiseLogs) {
                    if (dateWiseLogs.hasOwnProperty(date)) {
                        const logs = dateWiseLogs[date];
                        authorWorkLogHours[author][date] = `${this.getWorkLogHours(logs)}h`;
                    }
                }
            }
        }
        return authorWorkLogHours;
    }

    public getTableData(workLogs: AuthorWorkLogHours, weekDates: WeekDates, user?: string): ITable {
        const timesheet: ITable = {
            data: {
                columns: null
            }
        };
        let authors = Object.keys(workLogs);
        const dates = Object.keys(weekDates).sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime();
        });

        if (user) {
            user = user.toLowerCase();
            authors = authors.filter(author => author.toLowerCase().indexOf(user) !== -1);
        }
        timesheet.data.columns = {
            "User": new TableColumn<string>({
                index: 0,
                clickable: false,
                rows: authors
            })
        };

        for (let d = 0; d < dates.length; d++) {
            const date = dates[d];

            const rows = new Array(authors.length);
            for (let i = 0; i < authors.length; i++) {
                const author = authors[i];
                rows[i] = workLogs[author][date];
            }

            timesheet.data.columns[date] = new TableColumn<string>({
                index: d + 1,
                clickable: true,
                rows: rows
            });
        }

        return timesheet;
    }

    /**
     * @returns WeekDates
     * @param startDate
     * @param endDate - inclusive of end date
     */
    public getWeekDates(startDate: Date, endDate: Date): WeekDates {
        const weekDates: WeekDates = {};
        for (let date = startDate; date <= endDate; date = date.add(1)) {
            const dateString = date.toJiraDateString();
            weekDates[dateString] = dateString;
        }
        return weekDates;
    }
}