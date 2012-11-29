Ext.define('Sched.view.filter.Form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.groups',
    id: 'groups',

    bodyStyle: 'background: #F7F7F7;',
    width: 220,

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

            items: [{
                id: 'univerSelector',
                name: 'univer',
                emptyText: 'Выбор университета',
                store: 'Univers',
                displayField: 'title',
                valueField: '_id',
                onChange: function(val) {
                    var record = this.valueModels[0],
                        next = this.nextSibling();

                    next.clearValue();
                    if ( !record ) return;


                    next.bindStore( record.facultets() );
                    this.up('groups').fireEvent('univerChanged', record);
                }
            }, {
                id: 'facultetSelector',
                name: 'faculty',
                emptyText: 'Выбор факультета',
                displayField: 'title',
                valueField: '_id',
                onChange: function() {
                    var record = this.valueModels[0],
                        next = this.nextSibling();

                    next.clearValue();
                    if ( !record ) return;


                    next.bindStore( record.kafedras() );
                    this.up('groups').fireEvent('facultetChanged', record);
                }
            }, {
                id: 'kafedraSelector',
                name: 'chair',
                emptyText: 'Выбор кафедры',
                displayField: 'title',
                valueField: '_id',
                onChange: function() {
                    var record = this.valueModels[0];

                    if ( !record ) return;
                    this.up('groups').fireEvent('kafedraChanged', record);
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
                store: (function () {
                    var dt = new Date(), edf = Ext.Date.format,
                        curYear = edf(dt, 'Y'), curMonth = edf(dt, 'm'),
                        st = parseInt(curYear) + (curMonth > 6 ? 1 : 0),
                        years = [], i = 0;

                    for ( i = 0; i < 6; i++ ) years.push(st + i);
                    return years;
                }()),
                onChange: function(year) {
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
                onChange: function(group) {
                    var rec = this.up('groups').getForm().updateRecord().getRecord();
                    rec.save();
                    this.up('groups').fireEvent('groupChanged', this.valueModels[0]);
                }
            }, {
                xtype: 'button',
                text: 'Добавить группу',
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