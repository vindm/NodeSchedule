Ext.define('Sched.model.univer.Facultet', {
    extend: 'Ext.data.Model',
    requires: ['Sched.model.univer.Kafedra'],
    idProperty: '_id',
    fields: ['title', 'vk'],
    belongsTo: 'Sched.model.univer.Univer',
    hasMany: {
        model: 'Sched.model.univer.Kafedra',
        name: 'kafedras'
    }
});