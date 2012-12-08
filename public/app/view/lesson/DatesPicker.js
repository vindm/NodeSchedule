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
            change: me.valueToMonths
        };
    },

    setDay: function(day) {
        var me = this, p = me.picker;
        me.day = day;
        p && p.items.each(function( mon ) {
            mon.setEnabledDay( day );
            mon.fullUpdate( mon.value )
        });
        return me;
    },

    monthChange: function (dir) {
        var me = this,
            vals = [],
            change = function(mon, vals) {
                mon.fireEvent('monthChange', dir, vals);
            };

        me.mons.each(function ( mon ) {
            mon.month += dir;
            vals = me.months[ mon.month ] || [];
            change(mon, vals);
        })
    },
    valueToMonths: function () {
        var me = this,
            dates = me.value,
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

    createPicker: function() {
        console.log('create')
        var me = this,
            datePickers = [],
            i = me.startMonth,
            last = i + me.monthCount - 1;

        for ( ; i <= last; i++ ) {
            datePickers.push({
                month: i,
                values: me.months[i] || [],
                isFirst: i == me.startMonth,
                isLast: i == last,
                enabledDay: me.day
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
            dates = me.value;

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

    valueToRaw: function (value) {
        if ( !value || value.length < 1 ) return '';

        var me = this,
            ed = Ext.Date,  eD = ed.DAY,

            ind = 0,
            last = value.length,

            period = [ value[0] ],
            result = '',
            all = [];

        if ( last == 1 ) return ed.format(value[0], 'd M');

        while ( ind < last ) {
            if ( ed.isEqual( ed.add(value[ind], eD, 7), value[ind+1] ) ) {
                period.push( value[ind+1] );

            } else {
                all.push ( period );
                period = [ value[ind+1] ];

            }
            ind += 1;
        }

        result = all.map(function ( period ) {
            var len = period.length;
            return ed.format(period[0], 'd M') + ( len > 1 ? ( ' - ' + ed.format(period[len-1], 'd M') ) : '' );

        }).join(', ');

        return result;
    },
    rawToValue: function () {
        return this.value;
    }
});