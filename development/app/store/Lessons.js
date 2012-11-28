Ext.define('Sched.store.Lessons', {
    extend: 'Ext.data.Store',
    model: 'Sched.model.Lesson',
    storeId: 'lessonsStore',
    sorters: [{
        property: 'time'
    }],
    groupField: 'day'
});