Ext.define('Sched.model.Prepod', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [ '_univer', '_kafedra', 'firstName', 'lastName', 'thirdName', 'vkProfile', 'imageLink' ],
    proxy: {
        type: 'rest',
        url: '/prepods',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },

    getFullName: function () {
        return this.get('lastName') + ' ' + this.get('firstName')[0] + '. ' + this.get('thirdName')[0] + '.';
    }
});
