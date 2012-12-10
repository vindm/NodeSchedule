Ext.define('Sched.view.schedule.Day', {
    extend: 'Ext.grid.Panel',
    requires: ['Sched.store.Lessons'],
    alias: 'widget.day',
    config: {
        day:0
    },

    store: {
        model: 'Sched.model.Lesson',
        data: [],
        queryMode: 'local',
        sorters: [{
            sorterFn: function (a, b) {
                var t1 = a.get('time'), t2 = b.get('time');
                return ( t1 == t2 ) ? ( a.get('subIndex') > b.get('subIndex' ) ? 1 : -1 ) : ( t1 > t2 ) ? 1 : -1;
            }
        }]
    },
    defaults: {
        flex: 1
    },
    columns: [
        {
            text: 'Время',
            dataIndex: 'time'
        }, {
            text: 'Предмет',
            dataIndex: 'title'
        }, {
            text: 'Занятие',
            dataIndex: 'typ',
            renderer: function ( val, r, rec ) {
                var subChar = rec.get('_subGroup') && rec.get('subChar');
                if ( subChar ) val = val + '   ( ' + subChar + ' )';
                return val;
            }
        }, {
            text: 'Аудитория',
            dataIndex: 'audit'
        }, {
            text: 'Преподователь',
            dataIndex: 'prepod',
            renderer: function( val, rec, r ) {
                return r.getPrepodName();
            }
        }, {
            text: 'Даты',
            dataIndex: 'dates',
            renderer: function(val, el,  rec) {
                return rec.showDates();
            }
        }
    ]
});