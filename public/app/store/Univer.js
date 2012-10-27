Ext.define('Sched.store.Univer', {
    extend: 'Ext.data.Store',
    model: 'Sched.model.univer.Univer',
    proxy: {
        type: 'rest',
        url: '/univer',
        reader: {
            type: 'json',
            root: 'univer'
        }
    }
});