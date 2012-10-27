Ext.define('Sched.model.univer.Kafedra', {
    extend: 'Ext.data.Model',
    fields: ['_id', 'title'],
    belongsTo: 'Sched.model.univer.Kafedra',
    hasMany: {
        model: 'Sched.model.univer.Kurs',
        name: 'kursy'
    }
});