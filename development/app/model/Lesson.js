Ext.define('Sched.model.Lesson', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: ['_group', '_prepod',
        {
            name: 'dates', convert: function(value, record) {
                var clearTime = Ext.Date.clearTime;
                value = value || [];
                value = value.map( function (v) {
                    return clearTime(new Date(v), true);
                });
                return value;
            }
        },
        { name: 'day', type: 'int'},
        { name: 'time', type: 'int' },

        'title', 'typ', 'audit',

        { name: 'isSub', type: 'boolean', defaultValue: false },
        { name: '_sub_id' },
        { name: 'subCount', type: 'int', defaultValue: 0 },
        { name: 'subIndex', type: 'int', defaultValue: 0 },
        { name: 'subChars', type: 'int', defaultValue: 0 },
        { name: 'ch', type: 'string' }
    ],

    proxy: {
        type: 'rest',
        url: '/lessons',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },

    getPrepodName: function () {
        var prepod = Ext.StoreManager.get('Prepods').getById(this.get('_prepod'));
        if ( !prepod ) return '';
        return prepod.get('lastName') + ' ' + prepod.get('firstName')[0] + '. ' + prepod.get('thirdName')[0] + '.';
    }
});