Ext.define('Sched.view.lesson.form.Prepod', {
    extend: 'Ext.form.Panel',
    alias: 'widget.lessonPrepod',

    initComponent: function() {
        this.callParent();
        this.getForm().trackResetOnLoad = true;
    },
    defaults: {
        xtype: 'fieldset'
    },
    items: [{
        title: 'Университет',
        defaults: {
            xtype: 'combo',
            displayField: 'title',
            valueField: '_id',
            queryMode: 'local',
            anchor: '66%',
            labelWidth: '50%',
            labelAlign: 'right'
        },
        items: [{
                name: '_univer',
                fieldLabel: 'Университет',
                store: 'Univers',
                emptyText: 'Выбор университета',
                onChange: function(val) {
                    console.log('univer', val);

                    var record = this.valueModels[0],
                        next = this.nextSibling(),
                        nStore = next.getStore();

                    next.clearValue();
                    nStore.removeAll();

                    if ( !record ) {
                        this.clearValue();
                        return;
                    }

                    record.facultets().each(function(fac) {
                        nStore.add( fac.kafedras().data.items );

                    });console.log(nStore)
                }
            }, {
                name: '_kafedra',
                fieldLabel: 'Кафедра',
                emptyText: 'Выбор кафедры',
                store:  Ext.create('Ext.data.Store', {
                    fields: ['_id', 'title'],
                    data: []
                }),
                onChange: function(kaf) {
                    console.log('kaf', kaf)

                    var record = this.valueModels[0];
                    if ( !record ) {
                        this.clearValue();
                        return;
                    }
                }
            }
        ]
    }, {
        title: 'Преподаватель',
        defaults: {
            anchor: '66%',
            labelWidth: '50%',
            labelAlign: 'right',
            xtype: 'textfield'

        },
        items: [{
            name: '_id',
            xtype: 'combo',
            fieldLabel: 'Преподаватель',
            displayField: 'fullName',
            valueField: '_id',
            store: 'Prepods',
            queryMode: 'local',
            onChange: function (val) {
                console.log(this.getPicker())
                var form = this.up('form'),
                    newRec = this.valueModels && this.valueModels[0],
                    currentRec = form.getForm().getRecord();

                if ( newRec ) {
                    form.loadRecord(newRec);
                }
            }
        }, {
            name: 'firstName',
            fieldLabel: 'Имя',
            onChange: function (val) {
            }
        }, {
            name: 'thirdName',
            fieldLabel: 'Отчество'
        }, {
            name: 'lastName',
            fieldLabel: 'Фамилия'
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
    }]
});