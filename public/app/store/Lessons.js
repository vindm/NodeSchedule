Ext.define('Sched.store.Lessons', {
    extend: 'Ext.data.Store',
    model: 'Sched.model.Lesson',
    storeId: 'lessonsStore',
    remoteSort: false,
    remoteGroup: false,
    sorters: [{
        property: 'time'
    }],
    groupField: 'day'
});