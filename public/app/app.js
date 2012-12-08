Ext.application({
    name: 'Sched',
    models: [
        'univer.Univer', 'univer.Facultet', 'univer.Kafedra',
        'Schedule', 'Group', 'Prepod', 'Lesson'
    ],
    stores: ['Univers', 'Groups', 'Prepods', 'Lessons'],
    //requires: ['Sched.view.extended.Combo'],
    controllers: ['Main', 'Schedule', 'Lesson'],

    autoCreateViewport: true
});
