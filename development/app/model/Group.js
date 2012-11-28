Ext.define('Sched.model.Group', {
    extend: 'Ext.data.Model',
    idProperty: '_id',

    fields: [ '_univer', '_facultet', '_kafedra', 'title',
        { name: 'endYear', type: 'int' },
        { name: 'created', type: 'date' }
    ],
    proxy: {
        type: 'rest',
        url: '/groups',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    },

    getKurs: function () {
        var dt = new Date(),
            edf = Ext.Date.format,
            curYear = edf(dt, 'Y'),
            curMonth = edf(dt, 'm'),
            curSemestr = 0, kurs = 1;

        curSemestr = (curMonth > 6? 1: 0);
        kurs = 5 - (rec.get('endYear') - curYear - curSemestr);
        return kurs;
    }
});