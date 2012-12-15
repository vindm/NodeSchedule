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
            'week': {
                render: me.makeWeekDroppable,
                showGroupInfo: me.showGroupInfo
            },
            'day': {
                itemclick: me.onLessonClick,
                viewready: me.makeLessonsDraggable
            }
        });
    },
    onLaunch: function () {
        this.updateDays('all', 1);
    },

    showGroupInfo: function () {
        var me = this;
        console.log('from btn')
        me.application.fireEvent('editGroup')
    },

    makeWeekDroppable: function(v) {

        var me = this,
            panel = v,
            week = me.getWeek(),

            dragged, dragD,
            dropped, dropD;

        var moveAction = Ext.create('Ext.Action', {
            text: 'Переместить',
            disabled: true,
            handler: function(widget, event) {
                var upd = [dropD];

                dragged.set('time', dropped.get('time'));

                if ( dragD !== dropD ) {
                    upd.push(dragD);
                    dragged.set({
                        day: dropD,
                        dates: []
                    });
                }

                me.saveScheduleLessons(upd, dragged);
            }
        });
        var copyAction = Ext.create('Ext.Action', {
            text: 'Копировать',
            disabled: true,
            handler: function(widget, event) {
                var upd = [dropD],
                    copy = dragged.copy().data;

                delete copy['_id'];
                me.getLessonsStore().add(copy);

                dragged.set('time', dropped.get('time'));

                if ( dragD !== dropD ) {
                    upd.push(dragD);
                    dragged.set({
                        day: dropD,
                        dates: []
                    });
                }
                me.saveScheduleLessons(upd, dragged);
            }
        });
        var replaceAction = Ext.create('Ext.Action', {
            text: 'Поменять местами',
            disabled: true,
            handler: function(widget, event) {
                var dragT = dragged.get('time'),
                    upd = [dropD];

                dragged.set( 'time', dropped.get('time') );
                dropped.set( 'time', dragT );

                if ( dragD !== dropD ) {
                    upd.push(dragD);

                    dragged.set({ day: dropD, dates: [] });
                    dropped.set({ day: dragD, dates: [] });
                }
                me.saveScheduleLessons(upd, dragged);
            }
        });

        var dropMenu = Ext.create('Ext.menu.Menu', {
            items: [
                moveAction,
                copyAction,
                replaceAction
            ]
        });

        panel.dropZone = Ext.create('Ext.dd.DropZone', panel.getEl(), {

            getTargetFromEvent: function(e) {
                var col = e.getTarget('.x-panel-collapsed.x-grid');
                if ( col ) {
                    var day = week.child('#' + col.getAttribute('id'));
                    day && day.expand();
                }
                return e.getTarget('.x-grid-row');
            },

            onNodeDrop : function(target, dd, e, data) {
                var droppedDay = week.child( '#' + Ext.fly(target).up('.x-grid').id);

                dragged = data.lessonRecord;
                dragD = dragged.get('day');

                dropped = droppedDay.getView().getRecord(target);
                dropD = dropped.get('day');

                moveAction.enable();
                copyAction.enable();
                dropped.get('blank') ? replaceAction.disable() : replaceAction.enable();

                dropMenu.showAt(e.getXY());
                return true;
            }
        });

    },
    makeLessonsDraggable: function(v) {

        var gridView = v.getView();

        gridView.dragZone = Ext.create('Ext.dd.DragZone', gridView.getEl(), {
            getDragData: function(e) {
                var sourceEl = e.getTarget(gridView.itemSelector, 10), d;
                if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return gridView.dragData = {
                        ddel: d,
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        lessonRecord: gridView.getRecord(sourceEl)
                    };
                }
            },
            getRepairXY: function() {
                return this.dragData.repairXY;
            }
        });
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
        me.getWeek().down('#group_name').setText( 'Расписание группы ' + group.get('title') );
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

        dayGrid.getView().setLoading(false);
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