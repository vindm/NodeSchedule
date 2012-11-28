Ext.define('Sched.store.Schedules', {
    extend: 'Ext.data.Store',
    proxy: {
        model: 'Sched.model.Schedule',
        type: 'rest',
        url: '/schedules',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});