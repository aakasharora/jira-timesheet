export interface IJiraItem {
    id: number,
    self: string
}

export interface IJiraArray {
    startAt: number,
    maxResults: number,
    total: number
}

export interface IJiraAuthor extends IJiraItem {
    name: string,
    displayName: string,
    key: string,
}

export interface IJiraAuditDetail {
    created: Date,
    author: IJiraAuthor,
    updated: Date,
    updatedAuthor: IJiraAuthor
}

export interface IJiraWorkLog extends IJiraItem, IJiraAuditDetail {
    comment: string,
    started: Date,
    timeSpentSeconds: number,
    issueId: number
}

export interface IJiraIssue extends IJiraItem {
    key: string,
    fields: {
        worklog?: IJiraWorkLogField
    }
}

export interface IJiraWorkLogField extends IJiraArray {
    worklogs: IJiraWorkLog[]
}

export interface IJiraIssueField extends IJiraArray {
    issues: IJiraIssue[]
}