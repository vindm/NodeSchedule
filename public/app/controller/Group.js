Ext.define('Sched.controller.Group', {
    extend: 'Ext.app.Controller',
    models: ['Group'],
    stores: ['Groups'],
    views: ['group.Group', 'group.form.Common', 'group.form.Admins', 'group.Admins'],
    refs: [
        { selector: '#groupTabs', ref: 'tabs'},

        { selector: '#groupTabs #groupCommon', ref: 'common'},
        { selector: '#groupTabs #groupAdmins', ref: 'admins'},
        { selector: '#groupTabs #groupAdmins #admins', ref: 'adminsList'}
    ],

    init: function () {
        var me = this;
        me.application.on({
            groupChanged: me.changeGroup,
            editGroup: me.editGroup,
            scope: me
        });
        me.control({
            '#groupAdmins': {
                addAdmin: me.addAdmin
            },
            '#groupAdmins #admins': {
                deleteAdmin: me.deleteAdmin
            }
        })
    },

    onLaunch: function () {
        var me = this;

        me.win = Ext.create('Ext.window.Window', {
            id: 'groupWindow',
            title: '',
            items: { xtype: 'group' },
            buttons:[]
        });

        

        me.editGroup = function (create) {
            var me = this,
                group = me.curGroup,
                list = me.getAdminsList();

            me.getCommon().loadRecord( group );
            list.bindStore( group.admins() );
            me.win.setType('edit');
            me.win.show();
        };

        me.getCommon().on('validitychange', function(form, valid) {
            me.win.down('#saveBtn').setDisabled(!valid);
        });
    },

    changeGroup: function ( group, isNew) {
        var me = this;
        me.curGroup = group;

        isNew && me.editGroup(true);
    },

    addGroup: function (form) {
        var me = this,
            store = me.getGroupsStore(),
            group = {};
    },


    addAdmin: function (form) {
        var me = this,
            link = form.getValues().link;

        link = link.slice( link.lastIndexOf('/') + 1 );

        me.application.getController('Main').getVkUser([link], function(users) {
            var store = me.getAdminsList().getStore();
            store.add( users[0] );
            store.sync();
            console.log(store)
        });
    },

    deleteAdmin: function (admin) {
        var me = this,
            store = me.getAdminsList().getStore();
        store.remove( admin );
        store.sync();
    }
});
