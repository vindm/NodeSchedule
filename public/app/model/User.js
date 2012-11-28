Ext.define('Sched.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        'first_name', 'last_name',
        { name: 'uid', type: 'int' },
        { name: 'country',      type: 'int' },
        { name: 'city',         type: 'int' },
        { name: 'univer' },
        { name: 'faculty' },
        { name: 'chair' },
        { name: 'group',        type: 'int' },
        { name: 'graduation',   type: 'int' }
    ],

    proxy: {
        type: 'localstorage',
        id: 'userInfo'
    }
});