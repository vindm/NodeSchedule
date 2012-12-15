Ext.application({
    name: 'Sched',
    models: [
        'univer.Univer', 'univer.Facultet', 'univer.Kafedra',
        'Schedule', 'Group', 'Admin', 'Prepod', 'Lesson'
    ],
    stores: ['Univers', 'Groups', 'Prepods', 'Lessons'],
    //requires: ['Sched.view.extended.Combo'],
    controllers: ['Main', 'Group', 'Schedule', 'Lesson'],

    autoCreateViewport: true
});
