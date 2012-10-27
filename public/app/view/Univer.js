Ext.define('Sched.view.Univer', {
    extend: 'Ext.panel.Panel',
    id: 'univer',
    alias: 'widget.groupselect',
    defaults:{
        xtype: 'combo',
        displayField: 'title',
        queryMode: 'local',
        hidden: true
    },
    items: [{
        id: 'facList',
        emptyText: 'Выбор факультета'
    }, {
        id: 'kafList',
        emptyText: 'Выбор кафедры'
    }, {
        id: 'kursList',
        displayField: 'num',
        emptyText: 'Выбор курса'
    }]
});