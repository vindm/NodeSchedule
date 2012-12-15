Ext.define('Sched.view.schedule.Week', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.week',
    id: 'week',
    tbar: [
        { xtype: 'tbtext', id: 'group_name', text: 'Группа не выбрана' },
        { xtype: 'tbseparator' },
        { xtype: 'button', text: 'Редактирование', handler: function() {
            this.up('week').fireEvent('edit');
        }},
        '->',
        { xtype: 'button', text: 'Настройки группы', handler: function() {
            this.up('week').fireEvent('showGroupInfo');
        }}
    ],
    layout: {
        type: 'accordion',
        fill: false,
        animate: false
    },
    defaults: {
        xtype: 'day'
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
