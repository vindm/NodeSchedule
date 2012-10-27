Ext.define('Sched.model.schedule.Schedule', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title'],
    belongsTo: 'univer.Group'
});