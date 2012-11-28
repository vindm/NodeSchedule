Ext.define('Sched.view.schedule.Day', {
    extend: 'Ext.grid.Panel',
    requires: ['Sched.store.Lessons'],
    alias: 'widget.day',
    config: {
        day:0
    },
    initComponent: function() {
        var me = this,
            e = Ext;

        me.store = e.create('Ext.data.Store', {
            model: 'Sched.model.Lesson',
            data: [],
            queryMode: 'local'
        });

        me.callParent();

        var d = me.day, ear = e.Array;
        me.updateLessons = function() {
            var lessons = e.getStore('Lessons').getGroups(d),
                j = 0, fakes = [];
            lessons = ( lessons && lessons.children ) || [];
            while ( j < 8 ) {
                if ( !ear.some( lessons, function( l ) { return l.get('time') === j } ) ) {
                    fakes.push({
                        day: d,
                        time: j
                    });
                }
                j += 1;
            }
            me.store.loadData(lessons);
            me.store.add(fakes);
        };

        me.on('lessonsUpdated', me.updateLessons);
        me.updateLessons();
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
                var subChar = rec.get('subCount') > 0 && rec.get('ch');
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
            renderer: function(val, rec) {
                return val.map(function(date) {
                    return Ext.Date.format(new Date(date), 'd M')
                }).join(', ');
            }
        }
    ]
});