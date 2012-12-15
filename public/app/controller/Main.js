Ext.define('Sched.controller.Main', {
    extend: 'Ext.app.Controller',
    models: [
        'User',
        'univer.Univer', 'univer.Facultet', 'univer.Kafedra',
        'Group', 'Admin', 'Prepod', 'Schedule'
    ],
    stores: [ "Univers", 'Groups', 'Prepods' ],
    views: [ 'filter.Form' ],
    refs: [
        { selector: '#filter',                      ref: 'filterForm' },
        { selector: '#filter #univerSelector',      ref: 'univerSelect' },
        { selector: '#filter #facultetSelector',    ref: 'facultetSelect' },
        { selector: '#filter #kafedraSelector',     ref: 'kafedraSelect' },
        { selector: '#filter #gradSelector',        ref: 'gradSelect' },
        { selector: '#filter #groupSelector',       ref: 'groupSelect' },
        { selector: '#filter #addGroupBtn',         ref: 'addGroupBtn' },
    ],

    init: function () {
        var me = this,
            vars = {};

        VK.init(function () {
            var parts = document.location.search.substr(1).split("&"), part = [], i = 0;
            parts.forEach(function(part) { part = part.split('='); vars[part[0]] = part[1]; });

            me.vars = vars;
            me.fireEvent('vkInited', vars);
        });

        me.control({
            '#filter': {
                'univerChanged': me.onUniverChanged,
                'facultetChanged': me.onFacultetChanged,
                'kafedraChanged': me.onKafChanged,
                'endYearChanged': me.onEndYearChanged,
                'groupChanged': me.onGroupChanged,
                'addGroup': me.onAddGroup
            }
        });
    },

    onLaunch: function () {
        var me = this;

        me.getUniversStore().load({
            callback: function(records) {
                me.getUser();
            }
        });

    },

    getUser: function () {
        var me = this,
            model = me.getUserModel();

        model.load(1, { callback: function(record, operation) {

            if ( record && me.getUniversStore().getById(record.get('univer')) ) {
                console.log('get user from sessionSorage');
                me.bindUser( record );
                return;
            }

            console.log('get user from vk');
            var fn = function(vars) {
                me.getVkUser( [ vars.user ], function ( users ) { me.save( users[0] ); });
            };
            VK._inited && me.vars ? fn(me.vars) : me.on('vkInited', fn, me);

        },  scope: me });
    },
    getVkUser: function ( ids, fn ) {
        var me = this;

        VK.api('users.get', {  uids: ids.join(','), fields: 'first_name, last_name, universities, photo'  }, function (data) {
            var store = me.getUniversStore(),
                appl = Ext.apply,
                users = [];
            console.log(ids, data)
            users = data.response.map(function ( userData ) {
                var user = {
                        uid:        userData.uid,
                        first_name: userData.first_name,
                        last_name:  userData.last_name,
                        photo:      userData.photo
                    },
                    univer = false;

                userData.universities.forEach(function (edu) {
                    if ( edu.id !== 50 || edu.graduation < 2011 ) return;
                    univer = edu;
                });

                if ( !univer ) {
                    return user;
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
                user['graduation'] = univer.graduation;

                return user;
            });

            fn && fn( users );

        });
    },

    save: function (user) {
        var me = this,
            model = me.getUserModel();

        user = model.create(user);
        user.setId(1);
        user.save();

        console.log('user saved', user);
        me.bindUser( user );
    },
    bindUser: function ( user, vk ) {
        var me = this;
        me.user = user;
        me.getFilterForm().loadRecord(user);
    },

    loadGroups: function( id ) {
        this.getGroupsStore().load({
            params: {
                _univer: id
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
        if ( !univer ) return;

        me.loadPrepods( univer.getId() );
        me.loadGroups( univer.getId() );

        Ext.apply(Ext.form.field.VTypes, {
            used: function(val, field) {
                var store = me.getGroupsStore();

                return store.queryBy(function(group) {
                    return group.get('title') == val;
                }).getCount() < 1;
            },
            usedText: 'В университете ' + univer.get('title') + ' уже существует группа с таким номером.'
        });
    },
    onFacultetChanged: function (fac) {
        var me = this;

        me.curFac = fac;
        if(!fac) return;

        me.getGroupsStore().filterBy( function(item) {
            return item.get('_facultet') == fac.getId();
        });
    },
    onKafChanged: function (kaf) {
        var me = this;

        me.getAddGroupBtn().disable();

        me.curKaf = kaf;
        if(!kaf) return;

        me.getGroupsStore().filterBy( function(item) {
            return item.get('_kafedra') == kaf.getId();
        });

        if ( me.curYear ) me.getAddGroupBtn().enable();
    },

    onEndYearChanged: function (year) {
        var me = this;

        me.getAddGroupBtn().disable();

        me.curYear = year;
        if(!year) return;

        me.getGroupsStore().filterBy(function(item) {
            return item.get('endYear') == year;
        });

        if ( me.curKaf ) me.getAddGroupBtn().enable();
    },
    onGroupChanged: function (group, isNew) {
        var me = this;

        me.curGroup = group;
        if(!group) return;

        group.admins().proxy.extraParams = {
            '_group': group.getId()
        };

        isNew && group.admins().sync();
        me.application.fireEvent('groupChanged', group, isNew);
    },

    onAddGroup: function () {
        var me = this,
            store = me.getGroupsStore(),
            grmodel = me.getGroupModel(),
            admodel = me.getAdminModel(),
            admin = Ext.apply(me.user.data, {isMain: true}),
            group = {
                _univer: me.getUniverSelect().getValue(),
                _facultet: me.getFacultetSelect().getValue(),
                _kafedra: me.getKafedraSelect().getValue(),
                endYear: me.getGradSelect().getValue(),
                created: new Date()
            },
            groupModel = new grmodel(group);

        store.add(groupModel);
        store.sync({
            success: function () {
                var ad =  groupModel.admins();
                delete admin['_id'];
                ad.add(admin);
                me.onGroupChanged(groupModel, true)
            }
        });
    }
});