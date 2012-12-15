Ext.define('Sched.view.filter.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.groups',
    id: 'filter',

    bodyStyle: 'background: #F7F7F7;',
    width: 220,
    collapsible: true,
    collapseMode: 'mini',
    defaults: {
        xtype: 'fieldset',
        layout: 'anchor',
        border: 0,
        defaults: {
            xtype: 'combo',
            queryMode: 'local',
            anchor: '100%'
        }
    },
    items: [
        {
            title: 'Регион',

            items: [{
                id: 'countryList',
                emptyText: 'Выбор страны'
            }, {
                id: 'cityList',
                emptyText: 'Выбор города'
            }]
        },

        {
            title: 'Университет',

            defaults: {
                displayField: 'title',
                valueField: '_id',
                xtype: 'combo',
                queryMode: 'local',
                anchor: '100%'
            },
            items: [{
                id: 'univerSelector',
                name: 'univer',
                emptyText: 'Выбор университета',
                store: 'Univers',
                onChange: function(val) {
                    var record = this.valueModels[0],
                        next = this.nextSibling();

                    next.clearValue();

                    this.up('groups').fireEvent('univerChanged', record);

                    if ( !record ) {
                        this.clearValue();
                        return;
                    }

                    next.bindStore( record.facultets() );
                }
            }, {
                id: 'facultetSelector',
                name: 'faculty',
                emptyText: 'Выбор факультета',
                onChange: function(fac) {
                    var record = this.valueModels[0],
                        next = this.nextSibling();

                    next.clearValue();

                    this.up('groups').fireEvent('facultetChanged', record);

                    if ( !record ) {
                        this.clearValue();
                        return;
                    }
                    next.bindStore( record.kafedras() );

                }
            }, {
                id: 'kafedraSelector',
                name: 'chair',
                emptyText: 'Выбор кафедры',
                onChange: function(kaf) {
                    var record = this.valueModels[0];

                    this.up('groups').fireEvent('kafedraChanged', record);

                    if ( !record ) this.clearValue();
                }
            }]
        },

        {
            title: 'Вид',

            items: [{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    xtype: 'button',
                    toggleGroup: 'viewToggle',
                    flex: 1
                },
                items: [{
                    text: 'Группа',
                    pressed: true
                }, {
                    text: 'Преподаватель'
                }]
            }, {
                xtype: 'combo',
                id: 'gradSelector',
                emptyText: 'Год выпуска',
                name: 'graduation',
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
                    this.up('groups').fireEvent('endYearChanged', year);
                }
            }, {
                xtype: 'combo',
                id: 'groupSelector',
                name: 'group',
                store: "Groups",
                displayField: 'title',
                valueField: '_id',
                emptyText: 'Группа',
                forceSelection: true,
                onChange: function(group) {
                    var me = this;

                    if(!group) return;

                    var record = me.valueModels[0];
                    if ( !record ) {
                        me.clearValue();
                        return;
                    }

                    var form = me.up('groups'),
                        rec = form.getForm().updateRecord().getRecord();

                    form.fireEvent('groupChanged', record, false);
                    rec.save();
                }
            }, {
                xtype: 'button',
                text: 'Создать группу',
                id: 'addGroupBtn',
                handler: function () {
                    var form = this.up('groups');
                    form.fireEvent('addGroup');
                },
                disabled: true
            }
        ]
    }]

});

/*
 ,{
 title: 'Расписание',
 defaults: {
 anchor: '100%'
 },
 items: [{
 xtype: 'fieldcontainer',
 layout: 'hbox',
 defaults: {
 xtype: 'combo',
 queryMode: 'local',
 editable: false
 },
 items: [
 {
 id: 'eduYearSelect',
 emptyText: 'Учебный год',
 flex: 5,
 onChange: function(value) { this.up('form').fireEvent('yearChanged', value, this); },
 store: []
 },
 {
 id: 'semestrSelect',
 emptyText: 'Семестр',
 flex: 4,
 onChange: function(value) { this.up('form').fireEvent('semestrChanged', value, this); },
 store: []
 }
 ]
 }, {
 text: 'Добавить расписание',
 id: 'addSchedule',
 xtype: 'button'
 }]
 }
 */