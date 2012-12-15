Ext.define('Sched.view.group.Admins', {
    extend: 'Ext.view.View',
    alias: 'widget.admins',
    id: 'admins',
    store: [],
    onRender: function() {
        var me = this;
        me.callParent();

        me.getEl().on('click', function (e, t) {
            var target = e.getTarget(me.itemSelector),
                rec = me.getRecord(target);
            me.fireEvent('deleteAdmin', rec);
        }, me, {
            delegate: 'a.deleteAdmin'
        });
    },
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="admin">',
                '<table><tr><td>',
                    '<a href="/id{uid}"> <img width=25 src={photo}> </a>',
                '</td><td>',
                    '<a href="/id{uid}">{first_name} {last_name}</a><br>',
                    '<span class="actions">',
                        '<tpl if="isMain">',
                            'Главный администратор (<a href="#" class="changeAdmin">изменить</a>)',
                        '<tpl else>',
                            '<a href="#" class="deleteAdmin"">удалить</a>',
                            '<span class="divider"> | </span>',
                            '<a href="#" class="makeMain"">назначить главным администратором</a>',
                        '</tpl>',
                    '</span>',
                '</td></tr></table>',
            '</div>',
        '</tpl>'
    ),
    itemSelector: 'div.admin'
});
