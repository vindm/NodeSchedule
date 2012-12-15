Ext.define("Sched.view.group.Group", {
    extend: 'Ext.tab.Panel',
    requires: ['Sched.view.group.form.Common', 'Sched.view.group.form.Admins'],
    alias: 'widget.group',
    id: 'groupTabs',
    width: 600,
    items:[{
        xtype: 'groupCommon',
        id: 'groupCommon'
    }, {
        xtype: 'groupAdmins',
        id: 'groupAdmins'
    }]
});