Ext.define("Sched.view.group.form.Admins", {
    extend: 'Ext.form.Panel',
    requires: ['Sched.view.group.Admins'],
    alias: 'widget.groupAdmins',
    title: 'Руководство',
    layout: 'anchor',
    items:[{
        xtype: 'fieldset',
        title: 'Добавление администратора',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Ссылка на страницу:',
            name: 'link',
            anchor: '100%'
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: ' ', labelSeparator: ' ',
            items: {
                xtype: 'button', text: 'Добавить администратора',
                handler: function (btn) {
                    var form = btn.up('form');
                    form.fireEvent('addAdmin', form);
                }
            }
        }]
    }, {
        xtype: 'admins'
    }]

});