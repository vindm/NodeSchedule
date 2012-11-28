Ext.define('Sched.view.lesson.form.Prepod', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lessonPrepod',
    defaults: {
        anchor: '66%',
        labelWidth: '50%',
        labelAlign: 'right',
        xtype: 'textfield'
    },
    items: [{
        xtype: 'combo',
        fieldLabel: 'Фамилия',
        name: 'lastName',
        displayField: 'lastName',
        store: 'Prepods',
        hideTrigger: true
    }, {
        name: 'firstName',
        fieldLabel: 'Имя'
    }, {
        name: 'thirdName',
        fieldLabel: 'Отчество'
    }, {
        name: 'imageLink',
        fieldLabel: 'Ссылка на фотографию'
    }, {
        xtype: 'fieldcontainer',
        fieldLabel: ' ',
        labelSeparator: ' ',
        items: {
            xtype: 'button',
            text: 'Сохранить',
            handler: function (btn) {
                var form = this.up('lesson');
                form.fireEvent('prepodSave', form);
            }
        }
    }]
});