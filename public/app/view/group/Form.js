Ext.define("Sched.view.group.Form", {
    extend: 'Ext.form.Panel',
    alias: 'widget.groupEdit',
    layout: 'anchor',
    items: [ {
        xtype: 'textfield',
        fieldLabel: 'Номер группы',
        name: 'title',
        anchor: '100%'
    }, {
        xtype: 'numberfield',
        fieldLabel: 'год выпуска',
        name: 'endYear',
        anchor: '100%',
        minValue: '2013',
        maxValue: '2019'
    }]
});