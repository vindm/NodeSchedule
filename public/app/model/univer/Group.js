Ext.define('Sched.model.univer.Group', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title'],
    belongsTo: 'Kurs',
    hasMany: {
        model: 'schedule.Schedule',
        name: 'groups'
    }
});