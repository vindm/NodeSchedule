(function() {
    var chars = ['АБВГДЕЖ','ABCDEFG','1234567'];
    String.prototype.toSubGroupCharNum = function () {
        var num = 0;
        chars.forEach(function(val, ind) {
            if ( val.indexOf(this) > -1 ) num = ind;
        });
        return num;
    };
    Number.prototype.toSubGroupChar = function ( c ) {
        return ( chars[c] && chars[c][parseInt(this)] ) || 'А';
    };

    var days = ['', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    Number.prototype.toDay = function ( ) {
        return days[parseInt(this)]
    };

}()); // some prototype extending

Ext.application({
    name: 'Sched',
    models: [
        'univer.Univer', 'univer.Facultet', 'univer.Kafedra',
        'Schedule', 'Group', 'Prepod', 'Lesson'
    ],
    stores: ['Univers', 'Groups', 'Prepods', 'Lessons'],
    controllers: ['Main', 'Filter', 'Schedule', 'Lesson'],

    autoCreateViewport: true
});
