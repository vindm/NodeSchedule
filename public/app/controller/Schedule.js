Ext.define('Sched.controller.Schedule', {
    extend: 'Ext.app.Controller',
    models: ['Lesson', 'Prepod'],
    stores: ['Lessons'],
    views: ['schedule.Week', 'schedule.Day'],
    refs: [
        { selector: '#week', ref: 'week' },
        { selector: '#week #day-1', ref: 'd1' },
        { selector: '#week #day-2', ref: 'd2' },
        { selector: '#week #day-3', ref: 'd3' },
        { selector: '#week #day-4', ref: 'd4' },
        { selector: '#week #day-5', ref: 'd5' },
        { selector: '#week #day-6', ref: 'd6' }
    ],
    init: function () {
        var me = this;
        me.application.on({
            groupChanged: me.onGroupChanged,

            daysUpdated: me.updateDays,

            lessonSelected: me.changeSelection,
            lessonsUpdated: me.saveScheduleLessons,

            scope: me
        });
        me.control({
            'day': {
                itemclick: me.onLessonClick
            }
        });
    },
    onLaunch: function () {
        this.updateDays('all', 1);
    },

    onGroupChanged: function ( group ) {
        var me = this,
            groupId = group.getId();

        me.curGroup = group;

        me.getLessonsStore().load({
            params: {
                _group: groupId
            },
            callback: this.onLessonsLoaded,
            scope: me
        });
    },
    onLessonsLoaded: function ( data ) {
        var me = this;
        me.updateDays('all');
    },

    updateDays: function ( days, select ) {
        if ( !days || days.length < 1 ) return;

        var me = this;

        if ( days == 'all' ) {
            var day = 1;
            for( ; day <= 6; day++ ) {
                me.updateLessons( day );
            }

            select && me.changeSelection( select );
            return;
        }

        days.forEach(function ( day ) {
            me.updateLessons( day );
        });

        select && me.changeSelection( select );
    },
    updateLessons: function ( day, select ) {
        var me = this,
            group = me.curGroup && me.curGroup.getId(),
            dayGrid = me['getD' + day](),
            dayStore = dayGrid.getStore(),
            lessons = me.getLessonsStore().getGroups(day),
            fakes = [],
            j = 0,  ear = Ext.Array;

        lessons = ( lessons && lessons.children ) || [];

        while ( j < 8 ) {
            if ( !ear.some( lessons, function( l ) { return l.get('time') === j } ) ) {
                fakes.push({
                    _group: group,
                    day: day,
                    time: j,
                    blank: true
                });
            }
            j += 1;
        }

        dayStore.removeAll();
        dayStore.add(lessons);
        dayStore.add(fakes);
        dayStore.sort();

        select && me.changeSelection( select );
    },

    changeSelection: function ( select ) {
        var me = this,
            isNum = ( typeof select == 'number' ),
            dayGrid = me[ 'getD' + ( isNum ? select : select.get('day') ) ]();

        dayGrid.expand();
        !isNum && dayGrid.getSelectionModel().select( select );
    },

    onLessonClick: function ( grid, rec, item ) {
        var me = this,
            lessons = [rec],
            subId = rec.get('_subGroup');

        if ( subId ) lessons = me.findSubLessons(subId);
        me.application.fireEvent('editLesson', lessons, rec.get('subIndex'));
    },
    findSubLessons: function ( subId ) {
        var me = this,
            lessons = me.curLessons,
            res = [];

        res = me.getLessonsStore().queryBy(function(lesson) {
            return lesson.get('_subGroup') == subId;
        });
        res.sortBy(function(a, b) {
            return a.get('subIndex') > b.get('subIndex') ? 1 : -1;
        });
        res = res.items;

        return res;
    },

    saveScheduleLessons: function ( days, select ) {
        var me = this,
            lesStore = me.getLessonsStore();

        lesStore.sync({
            success: function () {
                days && me.updateDays( days, select );
            }
        });

    }
});