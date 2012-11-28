Ext.define('Sched.view.Viewport', {
    renderTo: Ext.getBody(),
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    items: [{
        xtype: 'week',
        region: 'center'

    }, {
        xtype: 'groups',
        region: 'east'

    }]
});