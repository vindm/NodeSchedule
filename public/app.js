Ext.application({
    name: "Sched",
    appFolder: "app",
    controllers: ['Univer', 'Schedule'],
    models: [
        'univer.Univer',
        'univer.Facultet',
        'univer.Kafedra',
        'univer.Kurs',
        'univer.Group',
        'schedule.Schedule'
    ],
    stores: ['Univer'],
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'panel',
                items: [{
                    xtype: 'groupselect'
                }]
            }]
        });
    }
});