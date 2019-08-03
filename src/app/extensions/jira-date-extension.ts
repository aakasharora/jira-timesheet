export { }

declare global {
    interface Date {
        toJiraDateString(): string;
    }
}

Date.prototype.toJiraDateString = function () {
    return (this as Date).toISOString().split('T')[0];
}

// Date.prototype.toMMMDD = function () {
//     return (this as Date).toDateString().substr(4, 6);
// }

