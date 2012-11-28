Ext.define('Sched.model.univer.Univer', {
    extend: 'Ext.data.Model',
    requires: ['Sched.model.univer.Facultet'],
    idProperty: '_id',
    fields: ['title', 'vk'],
    hasMany: {
        model: 'Sched.model.univer.Facultet',
        associationKey: 'facultets',
        name: 'facultets'
    },
    proxy: {
        type: 'rest',
        url: '/univer',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});