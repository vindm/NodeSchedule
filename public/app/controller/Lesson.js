Ext.define('Sched.controller.Lesson', {
    extend: 'Ext.app.Controller',
    models: ['Lesson', 'Prepod'],
    stores: ['Lessons', 'Prepods'],
    views: ['lesson.Lesson', 'lesson.DatesPicker', 'lesson.DatePicker',
        'lesson.form.Common', 'lesson.form.Auditory', 'lesson.form.Prepod', 'lesson.form.Dates'],
    refs: [
        { selector: '#lessonTabs', ref: 'tabs' },
        { selector: '#lessonTabs #commonForm', ref: 'lessonCommon' },
        { selector: '#lessonTabs #prepodForm', ref: 'lessonPrepod' },

        { selector: '#lessonTabs #datesForm', ref: 'lessonDates' },
        { selector: '#lessonTabs #datesForm #datesPicker', ref: 'datesPicker' }
    ],

    init: function () {
        var me = this;
        me.application.on({
            editLesson: me.onLessonStartEdit,
            newSubsSaved: me.onNewSubsSaved,
            scope: me
        });
        me.control({
            'lessonAuditory': {
                save: me.onLessonAuditorySave
            },
            'lessonPrepod': {
                save: me.onLessonPrepodSave
            }
        });

    },
    onLaunch: function() {
        var me = this;

        me.win = Ext.create('Ext.window.Window', {
            title: 'Настройки занятия',
            closeAction: 'hide',

            id: 'lessonWindow',
            tbar: {
                id: 'subsToggler',
                defaults: {
                    xtype: 'button',
                    toggleGroup: 'subLessons'
                },
                items: []
            },
            items: {
               xtype: 'lesson'
            }
        });

        var prepodForm = me.getLessonPrepod(),
            datesForm =  me.getLessonDates(),
            prepods = me.getPrepodsStore();

        me.bindLesson = function ( lesson ) {
            var prepod = prepods.getById( lesson.get('_prepod'));
            prepodForm.clearListeners();
            prepod && prepodForm.loadRecord(prepod);
            prepodForm.listeners = {
                save: me.onLessonPrepodSave,
                scope: me
            };

            datesForm.loadRecord(lesson);
            datesForm.on({
                datesChanged: me.onLessonDatesChanged,
                save: me.onLessonDatesSave,
                scope: me
            });
        };
    },


    onLessonStartEdit: function ( lessons, selectedIndex ) {
        var me = this,
            commonForm = me.getLessonCommon(),
            win = me.win;

        commonForm.loadRecord(lessons[0]);
        commonForm.on({
            commonSave: me.onLessonCommonChanged,
            subsSave: me.onLessonSubsChanged,
            scope: me
        });
        win.show();

        me.bindLessons( lessons, selectedIndex );

    },

    bindLessons: function (lessons, selected) {
        var me = this,
            tabs = me.win.down('#subsToggler'),
            cnt = lessons.length;

        me.curLessons = lessons;
        me.mainLesson = lessons[0];

        lessons = lessons.map(function ( lesson ) {
            return {
                text: 'Подгруппа ' + ( lesson.get('ch') ),
                lesson: lesson,
                toggleHandler: function (btn, state) {
                    me.bindLesson(this.lesson);
                }
            };
        });

        tabs.removeAll();
        tabs.add( lessons )[selected].toggle(true);
    },

    onLessonCommonChanged: function (form, fieldset) {
        var me = this,
            lesson = form.getRecord(),
            fields = form.getForm().getFieldValues(),
            subs = lesson.getSubGroups(),
            toSave = [];

        lesson.set(fields);
        if( !lesson.dirty ) return;
        me.application.fireEvent('lessonSaved', lesson);

        if ( subs.items ) {
            subs.each(function(sub) {
                sub.set(vals);
                me.application.fireEvent('lessonSaved', sub);
            });
        }
    },

    onLessonSubsChanged: function ( form ) {
        var me = this,
            values = form.getForm().getFieldValues(),

            count = values.subCount,
            chars = values.chars || 0;

        me.updateLessons(count, chars);
    },
    onNewSubsSaved: function( lessons ) {
        this.bindLessons( lessons );
    },
    updateLessons: function ( count, chars ) {
        var me = this,
            main = me.mainLesson,
            lesId = main.getId(),
            all = me.curLessons,
            cnt = all.length,
            removed = false, added = false;

        if ( cnt < count ) {
            var sub = main.copy().data,
                model= me.getScheduleLessonModel(),
                subLesson;
            delete sub['_id'];
            for ( var i = cnt; i < count; i++ ) {
                subLesson = Ext.create('Sched.model.schedule.Lesson', sub);
                delete subLesson.data['_id'];
                all.push( subLesson );
            }
        }
        else if ( cnt > count ) removed = all.splice(count, cnt - count);

        cnt = all.length;
        all.forEach( function( sub, ind ) {
            var num = ind,
                сh = (num).toSubGroupChar(chars);

            sub.set({
                me: num,
                _sub_id: lesId,
                chars: chars,
                ch: сh,
                subCount: cnt
            });

            if ( !sub.data['_id'] ) {
                if ( !added ) added = [];
                added.push(sub);
            }
        });

        this.application.fireEvent('subGroupsUpdated', lesId, added, removed);

        all = Ext.Array.sort(all, function( a, b ) {
            return a.get('me') > b.get('me') ? 1 : -1;
        });

        me.bindLessons(all);
        return all;
    },


    onLessonDatesChanged: function ( form ) {
        var me = this,
            lesson = form.getRecord(),
            fields = form.getForm().getFieldValues();
        fields['dates'] = me.getDatesPicker().value;
        var dayA = lesson.get('day');
        lesson.set(fields);
        if ( !lesson.dirty ) return;

        me.application.fireEvent('lessonDatesChanged', lesson, dayA);
    },
    onLessonDatesSave: function (form) {
        var lesson = form.getRecord();
        lesson.endEdit();
        this.application.fireEvent('lessonSaved', lesson);
    },

    onLessonAuditorySave: function (form) {
        var lesson = form.getRecord();
    },
    onLessonPrepodSave: function (form) {
        var lesson = form.getRecord();

    }
});