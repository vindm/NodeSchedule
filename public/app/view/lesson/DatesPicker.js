Ext.define('Sched.view.lesson.DatesPicker', {
    extend: 'Ext.form.Picker',
    alias: 'widget.datesPicker',
    matchFieldWidth: false,
    pickerAlign: 't-b',
    config: {
        startMonth: 8,
        monthCount: 4,
        day: 1
    },

    initComponent: function () {
        var me = this;
        me.months = [];
        me.value = [];
        me.callParent();

        me.listeners = {
            change: function (picker, dates) {
                me.valueToMonths();
            }
        };
    },

    monthChange: function (dir) {
        var me = this,
            vals = [];
        me.mons.each(function ( mon ) {
            vals = me.months[ mon.month + dir ] || [];
            mon.fireEvent('monthChange', dir, vals);
        })
    },

    createPicker: function() {
        var me = this,
            datePickers = [],
            i = me.startMonth,
            last = i + me.monthCount - 1;

        for ( ; i <= last; i++ ) {
            datePickers.push({
                month: i,
                isFirst: i == me.startMonth,
                isLast: i == last
            });
        }

        var picker = Ext.create('Ext.container.Container', {
            layout: 'hbox',
            floating: true,
            hidden: true,
            defaults: {
                xtype: 'dPicker',
                listeners: {
                    scope: me,
                    addValue: me.addValue,
                    removeValue: me.removeValue,
                    gMonthChange: me.monthChange
                }
            },
            items: datePickers
        });

        me.mons = picker.items;


        return picker;
    },



    addValue: function (mon, value) {
        var me = this,
            dates = me.getValue();

        dates.push(value);
        dates.sort(function(a, b) {
            if ( a.getMonth() > b.getMonth() ) {  return 1; }
            else if ( a.getMonth() == b.getMonth() ) {
                return ( a.getDate() > b.getDate() ) ?  1: -1;
            }
            return -1;
        });

        me.setValue(dates);
        me.fireEvent('change', me, dates);
    },
    removeValue: function (mon, value) {
        var me = this,
            dates = me.getValue(),
            ed = Ext.Date;

        dates.forEach(function (date, ind) {
            if ( ed.isEqual(date, value) ) {
                dates.splice( ind, 1 );
                return;
            }
        });
        me.setValue(dates);
        me.fireEvent('change', me, dates);
    },

    valueToMonths: function () {
        var me = this,
            dates = me.getValue(),
            months = [];
        dates.forEach(function (date) {
            var m = date.getMonth(),
                month = months[m] || [];
            month.push( date.getDate() );
            months[m] = month;
        });
        me.months = months;
        return months;
    },

    valueToRaw: function (value) {
        var me = this,
            ed = Ext.Date,
            val = value || [];

        return val.map(function(date) {
            return ed.format(date, 'd M')
        }).join(', ');
    },
    rawToValue: function () {
        return this.value;
    }
});