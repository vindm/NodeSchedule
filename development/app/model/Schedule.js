Ext.define('Sched.model.Schedule', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        '_univer', '_facultet',
        { name: 'year', type: 'int' },
        { name: 'semestr', type: 'int', defaultValue: 1 },
        { name: 'weeks', type: 'int', defaultValue: 2 },
        { name: 'firstWeek', type: 'int', defaultValue: 1 },
        { name: 'startDate', type: 'date' },
        { name: 'endDate', type: 'date' }
    ],
    groupField: 'year',
    groupDir  : 'DESC'
});