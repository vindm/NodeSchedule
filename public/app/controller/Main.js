Ext.define('Sched.controller.Main', {
    extend: 'Ext.app.Controller',
    models: [
        'User',
        'univer.Univer', 'univer.Facultet', 'univer.Kafedra',
        'Group', 'Prepod', 'Schedule'
    ],
    stores: [ "Univers", 'Groups', 'Prepods' ],
    views: [ 'filter.Form' ],
    refs: [
        { selector: '#filter',                      ref: 'filterForm' },
        { selector: '#filter #univerSelector',      ref: 'univerSelect' },
        { selector: '#filter #facultetSelector',    ref: 'facultetSelect' },
        { selector: '#filter #kafedraSelector',     ref: 'kafedraSelect' },
        { selector: '#filter #gradSelector',        ref: 'gradSelect' },
        { selector: '#filter #groupSelector',       ref: 'groupSelect' }
    ],

    init: function () {
        var me = this;
         me.control({
            '#filter': {
                'univerChanged':    me.onUniverChanged,
                'facultetChanged':  me.onFacultetChanged,
                'kafedraChanged':   me.onKafChanged,
                'endYearChanged':   me.onEndYearChanged,
                'groupChanged':     me.onGroupChanged
            }
        });
    },

    onLaunch: function () {
        var me = this;
        me.getUniversStore().load({
            callback: function(records) {
                console.log('univers loaded', records);
                me.getUser();
            }
        });

    },

    getUser: function () {
        var me = this,
            model = me.getUserModel();
        model.load(1, {
            callback: function(record, operation) {
                if ( !record ) {
                    console.log('user not found')
                    me.getFromVK();
                } else {
                    console.log('user found')
                    console.log(record)
                    me.bindUser( record );
                }
            },
            scope: me
        });
    },
    getFromVK: function () {
        var me = this,
            vars = {};

        VK && VK.init(function () {
            var parts = document.location.search.substr(1).split("&"),
                part = [], i = 0;

            for ( i = 0; i < parts.length; i++ ) {
                part = parts[i].split('=');
                vars[part[0]] = part[1];
            }

            VK.api('users.get', {  uids: vars.user, fields: 'universities'  }, function (data) {
                data = data.response[0];

                var store = me.getUniversStore(),
                    user = {
                        uid: data.uid,
                        first_name: data.first_name,
                        last_name: data.last_name
                    },
                    univer = false,
                    appl = Ext.apply;

                data.universities.forEach(function (edu) {
                    if ( edu.id !== 50 || edu.graduation < 2011 ) return;
                    univer = edu;
                });

                if ( !univer ) {
                    me.save(user);
                    return;
                }

                var u = univer.id,
                    f = univer.faculty,
                    k = univer.chair;

                u = store.findRecord('vk', u);
                f = u && u.facultets().findRecord('vk', f);
                k = f && f.kafedras().findRecord('vk', k);

                if ( u ) user['univer'] = u.getId();
                if ( f ) user['faculty'] = f.getId();
                if ( k ) user['chair'] = k.getId();
                //user['graduation'] = univer.graduation;

                me.save(user);

            });
        });
    },
    save: function (user) {
        var me = this,
            model = me.getUserModel();

        user = model.create(user);
        user.setId(1);
        user.save();

        console.log('user saved')
        console.log(user)
        me.bindUser( user );
    },
    bindUser: function ( user, vk ) {
        var me = this;
        me.user = user;
        me.getFilterForm().loadRecord(user);
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
        me.loadPrepods( univer.getId() );
    },
    onFacultetChanged: function (fac) {
        var me = this;
        me.loadGroups(fac.getId());
    },
    onKafChanged: function (kaf) {
        var me = this;
        if(!kaf) return;

        me.getGroupsStore().filterBy( function(item) {
            return item.get('chair') == kaf.getId();
        });
    },
    onEndYearChanged: function (year) {
        var me = this;
        if(!year) return;

        me.getGroupsStore().filterBy(function(item) {
            return item.get('endYear') == year;
        });
    },
    onGroupChanged: function (group) {
        var me = this;


        me.application.fireEvent('groupChanged', group);
    }
});