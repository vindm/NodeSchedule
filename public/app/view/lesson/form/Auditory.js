Ext.define('Sched.view.lesson.form.Auditory', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lessonAuditory',
    defaults: {
        xtype: 'fieldset',
        border: false,
        defaults: {
            anchor: '66%',
            labelWidth: '50%',
            labelAlign: 'right',
            xtype: 'combo',
            hideTrigger: true
        }
    },
    items: [{
        title: 'Аудитория',
        items: [{
            xtype: 'fieldcontainer',
            fieldLabel: 'Корпус',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'combo'
            },
            items: [{
                name: 'korpus_full',
                flex: 3
            }, {
                name: 'korpus',
                hideTrigger: true,
                flex: 1
            }]
        }, {
            name: 'location',
            fieldLabel: 'Адрес',
            xtype: 'textfield'
        }, {
            name: 'audit',
            fieldLabel: 'Аудитория',
            store: ['М-101', 'М-102', 'П-105']
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: ' ',
            labelSeparator: ' ',
            items: {
                xtype: 'button',
                text: 'Сохранить',
                handler: function (btn) {
                    var form = this.up('form');
                    console.log('clicked')
                    console.log(btn)
                    console.log(form)
                    form.fireEvent('auditorySave', form);
                }
            }
        }]
    }]
});