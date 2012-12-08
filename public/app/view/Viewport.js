Ext.define('Sched.view.Viewport', {
    extend: 'Ext.container.Viewport',
    renderTo: Ext.getBody(),
    layout: 'border',

    items: [{
        xtype: 'week',
        region: 'center'

    }, {
        xtype: 'groups',
        region: 'east'

    }]
});