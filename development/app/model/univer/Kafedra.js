Ext.define('Sched.model.univer.Kafedra', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: ['title', 'vk'],
    belongsTo: 'Sched.model.univer.Facultet'
});