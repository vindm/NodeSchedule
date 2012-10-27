Ext.define('Sched.model.univer.Kurs', {
    extend: 'Ext.data.Model',
    fields: ['id', 'endYear'],
    sorters:['num'],
    belongsTo: 'Kafedra',
    hasMany: {
        model: 'Sched.model.univer.Group',
        name: 'groups'
    }
});