Ext.define('Sched.model.univer.Univer', {
    extend: 'Ext.data.Model',
    fields: ['id', 'title'],
    hasMany: {
        model: 'Sched.model.univer.Facultet',
        name: 'facultets'
    }
});