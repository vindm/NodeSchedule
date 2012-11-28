Ext.define('Sched.view.schedule.Week', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.week',
    id: 'week',
    layout: {
        type: 'accordion',
        fill: false,
        flex: 1,
        animate: false
    },
    defaults: {
        xtype: 'day',
        collapsed: true
    },

    initComponent: function() {
        var me = this,
            days = [],
            names = Ext.Date.dayNames;

        for( var i = 1; i < 7; i++ ) {
            days.push({
                title: names[i],
                day: i,
                id: 'day-' + i
            });
        }
        me.items = days;

        me.callParent();
    }
});
