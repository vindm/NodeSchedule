Ext.define('Sched.view.lesson.Lesson', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.lesson',
    id: 'lessonTabs',
    width: 600,
    items: [{
        id: 'commonForm',
        title: 'Общее',
        xtype: 'lessonCommon'
    }, {
        id: 'datesForm',
        title: 'Время',
        xtype: 'lessonDates'
    }, {
        id: 'auditoryForm',
        title: 'Место',
        xtype: 'lessonAuditory'
    }, {
        id: 'prepodForm',
        title: 'Преподаватель',
        xtype: 'lessonPrepod'
    }]
});