Ext.define('Sched.view.lesson.form.Common', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lessonCommon',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    initComponent: function() {
        this.callParent();
        this.getForm().trackResetOnLoad = true;
    },
    defaults: {
        xtype: 'fieldset',
        border: false,
        width: 600,
        defaults: {
            anchor: '66%',
            labelWidth: '50%',
            labelAlign: 'right',
            xtype: 'combo',
            hideTrigger: true
        }
    },
    items: [{
        title: 'Занятие',
        items: [{
            name: 'title', fieldLabel: 'Предмет',
            store: ['Математика', 'javaScript'],
            minLength: 2
        }, {
            name: 'typ', fieldLabel: 'Тип',
            store: ['Лекция', 'Практика', 'Лабороторная'],
            hideTrigger: false,
            minLength: 2
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: ' ', labelSeparator: ' ',
            items: {
                xtype: 'button', text: 'Сохранить',
                handler: function (btn) {
                    var form = btn.up('form');
                    form.fireEvent('commonSave', form);
                }
            }
        }]
    }, {
        title: 'Подгруппы',
        items: [{
            name: 'subCount',
            fieldLabel: 'Количество',
            hideTrigger: false,
            autoSelect: true,
            store: [
                [1, 'Нет подгрупп'],
                [2, '2 подгруппы'],
                [3, '3 подгруппы'],
                [4, '4 подгруппы']
            ]
        }, {
            name: 'chars',
            fieldLabel: 'Обозначение',
            hideTrigger: false,
            hidden: true,
            hideMode: 'offsets',
            labelWidth: 185,
            autoSelect: true,
            store: [
                [0, 'А, Б, В,...'],
                [1, 'A, B, C,...'],
                [2, '1, 2, 3,...']
            ]
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: ' ',
            labelSeparator: ' ',
            items: {
                xtype: 'button',
                text: 'Сохранить',
                handler: function (btn) {
                    var form = btn.up('lessonCommon');
                    form.fireEvent('subsSave', form);
                }
            }
        }]
    }]
});