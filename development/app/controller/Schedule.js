Ext.define('Sched.controller.Schedule', {
    extend: 'Ext.app.Controller',
    models: ['Lesson', 'Prepod'],
    stores: ['Lessons'],
    views: ['schedule.Week', 'schedule.Day'],
    refs: [
        { selector: '#week', ref: 'week' }
    ],
    init: function () {
        var me = this;
        me.application.on({
            groupChanged: me.onGroupChanged,

            lessonDatesChanged: me.onLessonDatesChanged,
            subGroupsUpdated: me.onSubGroupsUpdated,
            lessonSaved: me.saveScheduleLessons,

            scope: me
        });
        me.control({
            'day': {
                itemclick: me.onLessonClick
            }
        });
    },
    onLaunch: function () {
        var me = this,
            dt = new Date(),
            curYear = Ext.Date.format(dt, 'Y'),
            curMonth = Ext.Date.format(dt, 'm'),
            semestr = (curMonth > 6 ? 2 : 1);

        me.curDay = 0;
    },

    onGroupChanged: function ( group ) {
        var me = this,
            groupId = group.getId();

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
        me.updateDays();
    },

    changeDay: function ( d ) {
        var me = this,
            dayGrid = me.getWeek().child('#day-' + d);
        if ( me.curDay == d ) return dayGrid;
        me.curDay = d;
        dayGrid.expand();
        return dayGrid;
    },

    updateDays: function ( d ) {
        var me = this,
            day = me.getWeek(), i = 0;

        for( i = (d? d: 1); i <= (d? d: 6); i++ ) {
            day.child('#day-' + i).fireEvent('lessonsUpdated');
        }
    },

    onLessonClick: function(grid, rec, item) {
        var me = this,
            lessons = [rec],
            subId = rec.get('_sub_id');

        if ( subId ) lessons = me.findSubLessons(subId);
        me.application.fireEvent('editLesson', lessons, rec.get('subIndex'));
    },
    findSubLessons: function(subId) {
        var me = this,
            lessons = me.curLessons,
            res = [];

        res = lessons.queryBy(function(lesson) {
            return lesson.get('_sub_id') == subId;
        });
        res.sortBy(function(a, b) {
            return a.get('me') > b.get('me') ? 1 : -1;
        });
        res = res.items;

        return res;
    },
    onSubGroupsUpdated: function( subId, added, removed ) {
        var me = this,
            lessons = me.curLessons;

        removed && lessons.remove( removed );

        if( added ) {
            var nl = lessons.add( added );
            console.log(added)
            nl[0].save({
                callback: function(rec) {
                    console.log(rec)
                }
            })
        }
        console.log(lessons)
    },

    onLessonDatesChanged: function(lesson, dayA) {
        var me = this,
            week = lesson.get('week'),
            dayB = lesson.get('day');

        if ( me.curWeek !== week && week !== 0 ) {
            me.changeWeek( week );
            if ( dayA !== dayB ) me.changeDay(dayB).getSelectionModel().select(lesson);
            return;
        }
        if ( dayA !== dayB ) {
            me.moveLesson(dayA, dayB, lesson);
            me.updateDay(dayB);
            me.changeDay(dayB).getSelectionModel().select(lesson);
            me.updateDay(dayA);
            return;
        }
        me.update(dayB);

    },
    moveLesson: function(dayA, dayB, lesson) {
        var week = this.getWeek();
        week.child('#day-' + dayA).getStore().remove(lesson);
        week.child('#day-' + dayB).getStore().add(lesson);
    },

    saveScheduleLessons: function ( upd ) {
        var me = this;
        me.curLessons.sync({
            success: function () {
                upd && me.updateDays();

            }
        });

    }
});