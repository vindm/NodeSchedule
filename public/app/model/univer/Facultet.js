Ext.define('Sched.model.univer.Facultet', {
    extend: 'Ext.data.Model',
    fields: ['_id', 'title'],
    belongsTo: 'Sched.model.univer.Univer',
    hasMany: {
        model: 'Sched.model.univer.Kafedra',
        name: 'kafedras'
    }
});