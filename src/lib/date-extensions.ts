export { }

// DATE EXTENSIONS
// ================

declare global {
    interface Date {
        add(days?: number): Date,
        startOfWeek(): Date
    }
}

/**
 * Add number of days to the date object
 * @returns a new Date object
 */
Date.prototype.add = function (days: number = 0) {
    // 1 day = 86400000 ms;
    return new Date((this as Date).valueOf() + days * 86400000);
}

Date.prototype.startOfWeek = function () {
    const today = this as Date;
    return today.add(-today.getDay());
}