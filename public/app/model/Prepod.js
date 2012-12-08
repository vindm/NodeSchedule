Ext.define('Sched.model.Prepod', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        '_univer', '_kafedra',
        'firstName', 'lastName', 'thirdName',
        'vkProfile', 'imageLink',
        {
            name: 'fullName', convert: function (value, record) {
                return record.get('lastName') + ' ' + record.get('firstName')[0] + '. ' + record.get('thirdName')[0] + '.';
            }
        }
    ],

    proxy: {
        type: 'rest',
        url: '/prepods',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
