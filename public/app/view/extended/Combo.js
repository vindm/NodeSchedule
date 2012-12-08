Ext.define('Sched.view.extended.Combo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.exCombo',
    initComponent: function() {
        var me = this;
        me.callParent();
        me.listConfig = {
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{me.displayField}</div>',
                '</tpl>'
            )
        };


        console.log( me.getPicker())
    }

});