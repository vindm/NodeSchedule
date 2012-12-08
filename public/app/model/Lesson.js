Ext.define('Sched.model.Lesson', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        { name: '_group', defaultValue: null },

        { name: 'blank', type: 'boolean', defaultValue: false },

        { name: 'title', type: 'string' },
        { name: 'typ', type: 'string' },

        { name: '_subGroup', defaultValue: null },
        { name: 'subIndex', type: 'int', defaultValue: 0 },
        { name: 'subChar', type: 'string' },

        { name: 'time', type: 'int' },
        { name: 'day', type: 'int'},
        { name: 'dates', convert: function(value, record) {
            var clearTime = Ext.Date.clearTime;
            value = value || [];
            value = value.map( function (v) {
                return clearTime(new Date(v), true);
            });
            return value;
        }},

        { name: 'audit', type: 'string' },

        { name: '_prepod', defaultValue: null }
    ],

    proxy: {
        type: 'rest',
        url: '/lessons',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },

    showDates: function() {
        var me = this,
            value = me.get('dates'),
            ed = Ext.Date,  eD = ed.DAY,

            ind = 0,
            last = value.length,

            period = [ value[0] ],
            result = '',
            all = [];

        if ( !value || value.length < 1 ) return '';

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

    getCharSet: function () {
        var ch = this.get('subChar'),
            rus = /[\u0400-\u04FF)]/g,
            eng = /[A-Z]/g;

        return rus.test(ch) ? 0 : ( eng.test(ch) ? 1 : 2 );
    },

    setChar: function ( charSet ) { // 0 = rus, 1 = eng, 2 = num
        var ind = this.get('subIndex'),
            ch = '';

        if ( charSet == 1 ) ch = String.fromCharCode( 65 + ind );
        else if ( charSet == 0 ) ch = String.fromCharCode( 1072 + ind );
        else ch = ind.toString();

        this.set( 'subChar', ch.toUpperCase() );
    },

    getPrepodName: function () {
        var prepod = Ext.StoreManager.get('Prepods').getById(this.get('_prepod'));
        if ( !prepod ) return '';
        return prepod.get('fullName');
    }
});