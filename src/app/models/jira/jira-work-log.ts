import { IJiraWorkLog, IJiraAuthor } from "./jira-models";

export class JiraWorkLog implements IJiraWorkLog {
    started: Date;
    comment: string;
    timeSpentSeconds: number;
    issueId: number;
    id: number;
    self: string;
    created: Date;
    author: IJiraAuthor;
    updated: Date;
    updatedAuthor: IJiraAuthor;

    constructor(log: IJiraWorkLog) {
        if (!log) {
            return;
        }
        ['created', 'updated', 'started'].forEach(key => {
            if (typeof log[key] === 'string') {
                log[key] = new Date(log[key]);
            }
        });
        for (const key in log) {
            this[key] = log[key];
        }
    }
}
