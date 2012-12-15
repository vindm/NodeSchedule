Ext.define('Sched.model.Admin', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        'first_name', 'last_name', 'photo',
        { name: 'uid', type: 'int' },
        { name: 'isMain', type: 'boolean', defaultValue: false }
    ],
    proxy: {
        type: 'rest',
        url: '/admins',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },

    belongsTo: 'Sched.model.Group'
});