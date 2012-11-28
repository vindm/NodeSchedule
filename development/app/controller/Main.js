Ext.define('Sched.controller.Main', {
    extend: 'Ext.app.Controller',
    models: ['User', 'univer.Univer', 'univer.Facultet', 'univer.Kafedra'],
    stores: ["Univers"],
    onLaunch: function () {
        var me = this;
        me.getUser();
    },

    getUser: function () {
        var me = this;
        if ( typeof(Storage)!=="undefined" ) {
            var model = me.getUserModel();
            model.load(1, {
                scope: this,
                callback: function(record, operation) {
                    if ( !record ) {
                        me.getFromVK();
                    } else {
                        console.log(record)
                        me.bindUser( record );
                    }
                }
            });
        }
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
                user['graduation'] = univer.graduation;

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
        console.log(user)
        me.bindUser( user );
    },
    bindUser: function ( user ) {
        var me = this;
        me.user = user;
        me.application.fireEvent('userBinded', user);
    }
});