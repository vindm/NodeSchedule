Ext.define("Sched.view.group.form.Common", {
    extend: 'Ext.form.Panel',
    alias: 'widget.groupCommon',
    title: 'Информация',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    defaults: {
        xtype: 'fieldset',
        border: 0,
        width: 600,
        defaults: {
            width: 400,
            labelWidth: 200,
            labelAlign: 'right'
        }
    },
    items:[{
        title: 'Университет',
        defaults: {
            width: 400,
            labelWidth: 200,
            labelAlign: 'right',
            displayField: 'title',
            valueField: '_id',
            xtype: 'combo',
            queryMode: 'local',
            readOnly: true
        },
        items: [{
            name: '_univer',
            emptyText: 'Выбор университета',
            fieldLabel: 'Университет',
            store: 'Univers',
            onChange: function(val) {
                var record = this.valueModels[0],
                    next = this.nextSibling();

                next.clearValue();

                if ( !record ) {
                    this.clearValue();
                    return;
                }

                next.bindStore( record.facultets() );
            }
        }, {
            name: '_facultet',
            emptyText: 'Выбор факультета',
            fieldLabel: 'Факультет',
            onChange: function(fac) {
                var record = this.valueModels[0],
                    next = this.nextSibling();

                next.clearValue();

                if ( !record ) {
                    this.clearValue();
                    return;
                }
                next.bindStore( record.kafedras() );

            }
        }, {
            name: '_kafedra',
            emptyText: 'Выбор кафедры',
            fieldLabel: 'Кафедра',
            onChange: function(kaf) {
                var record = this.valueModels[0];
                if ( !record ) this.clearValue();
            }
        }]
    },
    {
        title: 'Группа',
        items: [{
            xtype: 'combo',
            emptyText: 'Год выпуска',
            fieldLabel: 'Год выпуска',
            name: 'endYear',
            editable: false,
            store: (function () {
                var dt = new Date(), edf = Ext.Date.format,
                    curYear = edf(dt, 'Y'), curMonth = edf(dt, 'm'),
                    st = parseInt(curYear) + (curMonth > 6 ? 1 : 0),
                    years = [], i = 0;

                for ( i = 0; i < 6; i++ ) years.push(st + i);
                return years;
            }()),
            onChange: function(year) {
                if(year == 0) return;
            }
        }, {
            xtype: 'textfield',
            fieldLabel: 'Номер группы',
            allowBlank: false,
            vtype: 'used',
            msgTarget: 'side',
            name: 'title'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Ссылка на группу ВКонтакте',
            name: 'vk_link'
        }]
    }]

});