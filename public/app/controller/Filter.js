Ext.define('Sched.controller.Filter', {
    extend: 'Ext.app.Controller',
    views: ['filter.Form'],
    models: [
        'User',
        'univer.Univer', 'univer.Facultet', 'univer.Kafedra',
        'Group', 'Prepod', 'Schedule'
    ],
    stores: ['Univers', 'Groups', 'Prepods', 'Schedules'],
    refs: [
        { selector: '#groups', ref: 'filterForm' },
        { selector: '#groups #univerSelector',      ref: 'univerSelect' },
        { selector: '#groups #facultetSelector',    ref: 'facultetSelect' },
        { selector: '#groups #kafedraSelector',     ref: 'kafedraSelect' },
        { selector: '#groups #gradSelector',        ref: 'gradSelect' },
        { selector: '#groups #groupSelector',        ref: 'groupSelect' }
    ],
    init: function () {
        var me = this;
        me.application.on('userBinded', me.onUserBinded, me);
        me.control({
            '#groups': {
                univerChanged: me.onUniverChanged,
                facultetChanged: me.onFacultetChanged,
                kafedraChanged: me.onKafChanged,
                endYearChanged: me.onEndYearChanged,
                groupChanged: me.onGroupChanged
            }
        });
    },

    onUserBinded: function( user ) {
        var me = this,
            form = me.getFilterForm();
        form.loadRecord(user);
    },

    loadGroups: function( facId ) {
        this.getGroupsStore().load({
            params: {
               _facultet: facId
            },
            callback: function (data) {
                console.log(data)
            }
        });
    },
    loadPrepods: function( univerId ) {
        this.getPrepodsStore().load({
            params: {
                _univer: univerId
            },
            callback: function (data) {

            }
        });
    },

    onUniverChanged: function ( univer ) {
        var me = this;

        me.curUniver = univer;
        me.loadPrepods( univer.getId() );
    },
    onFacultetChanged: function (fac) {
        var me = this;

        me.curFac = fac;
        me.loadGroups(fac.getId());
    },
    onKafChanged: function (kaf) {
        var me = this;
        if(!kaf) return;

        me.curKaf = kaf;

        me.getGroupsStore().filterBy( function(item) {
            return item.get('chair') == kaf.getId();
        });
    },
    onEndYearChanged: function (year) {
        var me = this;
        me.curGrad = year;
        if(!year) return;

        me.getGroupsStore().filterBy(function(item) {
            return item.get('endYear') == year;
        });
    },
    onGroupChanged: function (group) {
        var me = this;
        me.curGroup = group;
        me.application.fireEvent('groupChanged', group);
    }
});