Ext.define('Sched.view.univer.GroupList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.groupList',
    id: 'groups',
    tbar: [{
        text: 'Добавить группу',
        id: 'addGroup'
    }],
    features: [{ftype: 'grouping', hideGroupedHeader: 'true'}],
    store: Ext.create('Ext.data.Store', {
        model: 'Sched.model.univer.Group',
        queryMode: 'local',
        data: []
    }),
    columns: [
        { text: 'Группа', dataIndex: 'title', flex: 1 },
        { text: 'Добавлена', dataIndex: 'created', flex: 1,
          renderer: function (val) {
              return Ext.Date.format(new Date(val), 'F j, Y');
          }},
        { text: 'Администратор', dataIndex: 'authorName', flex: 1,
          renderer: function (val, meta, rec) {
              var admins = rec.admins();
              return admins.getAt(admins.findExact('author', true)).get('title')
          }
        }
    ]
});
