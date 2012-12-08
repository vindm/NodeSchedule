Ext.define('Sched.view.lesson.form.Dates', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lessonDates',
    initComponent: function() {
        this.callParent();
        this.getForm().trackResetOnLoad = true;
    },
    defaults: {
        anchor: '66%',
        labelWidth: '50%',
        labelAlign: 'right',
        xtype: 'combo',
        editable: false
    },
    items: [{
        name: 'time',
        fieldLabel: 'Время',
        store: [
            [0, '08:45 - 10:15'],
            [1, '10:25 - 11:55'],
            [2, '12:35 - 14:05'],
            [3, '14:10 - 15:40'],
            [4, '15:50 - 17:20'],
            [5, '17:25 - 18:55'],
            [6, '19:05 - 20:35']
        ]
    }, {
        name: 'day',
        fieldLabel: 'День',
        store: function () {
            var d = 1,
                store = [],
                names = Ext.Date.dayNames;

            for ( ; d < 7; d++ ) store.push( [d, names[d]] );
            return store;
        }(),
        onChange: function(val){
            this.nextSibling().setDay(val);
        }
    }, {
        xtype: 'datesPicker',
        id: 'datesPicker',
        name: 'dates',
        fieldLabel: 'Даты',
        startDate: new Date('2012,9,1'),
        endDate: new Date('2012,12,31')
    }, {
        xtype: 'fieldcontainer',
        fieldLabel: ' ',
        labelSeparator: ' ',
        items: {
            xtype: 'button',
            text: 'Сохранить',
            handler: function ( btn ) { var f = btn.up('lessonDates'); f.fireEvent( 'save', f ); }
        }
    }]
});