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

            datesForm.loadRecord( lesson );
            datesForm.on({
                save: me.onLessonDatesChanged,
                scope: me
            });

            var prepod = prepods.getById( lesson.get('_prepod') );
            prepodForm.clearListeners();
            prepod && prepodForm.loadRecord(prepod);
            prepodForm.listeners = {
                save: me.onLessonPrepodSave,
                scope: me
            };


        };
    },


    onLessonStartEdit: function ( lessons, selectedIndex ) {
        var me = this,
            commonForm = me.getLessonCommon(),
            form = commonForm.getForm(),
            win = me.win;

        commonForm.loadRecord(lessons[0]);
        form.findField('subCount').setValue( lessons.length );
        form.findField('subChars').setValue( lessons[0].getCharSet() );

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

        cnt < 2 ? tabs.hide() : tabs.show();

        me.curLessons = lessons;
        me.mainLesson = lessons[0];

        lessons = lessons.map(function ( lesson ) {
            return {
                text: 'Подгруппа ' + ( lesson.get('subChar') ),
                lesson: lesson,
                toggleHandler: function (btn, state) {
                    me.bindLesson( this.lesson );
                    me.application.fireEvent('lessonSelected', lesson);
                }
            };
        });

        tabs.removeAll();
        tabs.add( lessons )[selected||0].toggle(true);
    },

    onLessonCommonChanged: function ( form ) {
        var me = this,
            fields = form.getForm().getFieldValues(),
            lessons = me.curLessons,
            store = me.getLessonsStore();

        lessons.forEach(function(sub) {
            sub.set(fields);
            if ( sub.get('blank') ) {
                sub.set('blank', false);
                store.add( sub );
            }
        });

        me.application.fireEvent( 'lessonsUpdated', [] );

    },
    onLessonSubsChanged: function ( form ) {
        var me = this,

            values = form.getForm().getFieldValues(),
            count = values.subCount,
            chars = values.subChars || 0,

            lessonsStore = me.getLessonsStore(),
            main = me.mainLesson,
            all = me.curLessons,

            lesId = main.getId(),
            cnt = all.length,

            ex = Ext,
            dirty = true;

        if ( cnt < count ) {
            var sub = main.copy().data;
            delete sub['_id'];

            for ( ; cnt < count; cnt++ ) all.push( lessonsStore.add(sub)[0] );

        }
        else if ( cnt > count ) lessonsStore.remove( all.splice(count, cnt - count) );
        else dirty = false;

        cnt = all.length;

        all.forEach( function( sub, num ) {
            sub.set({
                _subGroup: cnt == 1 ? null : lesId,
                subIndex: num
            });
            sub.setChar( chars );
        });

        me.application.fireEvent( 'lessonsUpdated', dirty ? [ main.get('day') ] : [], false );

        if ( cnt > 1 ) all = ex.Array.sort(all, function( a, b ) {
            return a.get('subIndex') > b.get('subIndex') ? 1 : -1;
        });

        me.bindLessons(all);
        return all;
    },

    onLessonDatesChanged: function ( form ) {
        var me = this,
            lesson = form.getRecord(),
            fields = form.getForm().getFieldValues(),
            days = [], prevDay = 1, curDay = 1,
            select = false;

        fields['dates'] = me.getDatesPicker().value;

        prevDay = lesson.get('day');
        curDay = fields['day'];
        days = ( prevDay == curDay ) ? [ curDay ] : [ curDay, prevDay ];

        lesson.set(fields);
        if ( !lesson.dirty ) return;

        me.application.fireEvent('lessonsUpdated', days, lesson);
    },

    onLessonAuditorySave: function (form) {
        var lesson = form.getRecord();
    },
    onLessonPrepodSave: function (form) {
        var lesson = form.getRecord();

    }
});