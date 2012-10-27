Ext.define('Sched.controller.Univer', {
    extend: 'Ext.app.Controller',
    views: ['Univer'],
    models: [
        'univer.Univer',
        'univer.Facultet',
        'univer.Kafedra',
        'univer.Kurs',
        'univer.Group',
        'schedule.Schedule'
    ],
    stores: ['Univer'],
    refs: [{
        selector: '#facList', ref: 'facList'
    }, {
        selector: '#kafList', ref: 'kafList'
    }, {
        selector: '#kursList', ref: 'kursList'
    }],

    onLaunch: function () {
        var me = this,
            univerStore = this.getUniverStore();

        VK.init(function () {
            console.log('vk')
        });

        univerStore.load({
            callback: me.onUniverDataLoad,
            scope: me
        });
    },

    init: function () {
        this.control({
            '#groups_selector': {
                render: this.onPanelRender
            },
            '#univer > #facList': {
                select: this.onFacSelect,
                change: function (cmb, val) {
                    console.log(val)
                }
            },
            '#univer > #kafList': {
                select: this.onKafSelect
            },
            '#univer > #kursList': {
                select: this.onKursSelect
            }
        });
    },

    onUniverDataLoad: function (data) {
        var engec = this.getUniverStore().first(),
            facs = engec.facultets();

        var facList = this.getFacList();
        facList.bindStore(facs).show();
    },
    onFacSelect: function (cmb, rec) {
        this.getKafList()
            .bindStore(rec[0].kafedras())
            .show().clearValue();
        this.getKursList().hide();

    },
    onKafSelect: function (cmb, rec) {
        this.getKursList();
        this.getKursList()
            .bindStore(rec[0].kursy())
            .show().clearValue();
    },
    onKursSelect: function (cmb, rec) {

    },

    onPanelRender: function () {
        console.log('Панель отрендерена')
    }

});