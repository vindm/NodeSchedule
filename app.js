var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose');

var app = express(),
    db = mongoose.connect('mongodb://heroku:2415868644@alex.mongohq.com:10014/app8775015');
    //db = mongoose.createConnection('localhost', 'test');

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);

});
app.configure('development', function () {
    app.use(express.errorHandler());
    //app.use(express.static(path.join(__dirname, '')));
    //app.use(express.static(path.join(__dirname, 'public/production')));
    app.use(express.static(path.join(__dirname, 'public')));
});

var models = require('./models/Schedule').models(db),
    Univer = models.Univer,
    Prepod = models.Prepod,
    Group = models.Group,
    Lesson = models.Lesson;

createStruct = function() {


    Univer.remove(function (err) {
        var univer2 = new Univer({
            title: "Иdddddd",
            vk: 111,
            facultets: [{
                title: "Информационных систем в экономике и управлении",
                vk: 1111,
                kafedras: [{
                    title: "Информационных систем в экономике",
                    vk: 11111
                }]
            }]
        });
        univer2.save(function(err) {

        });
        var univer = new Univer({
            title: "ИНЖЭКОН",
            vk: 50,
            facultets: [{
                title: "Информационных систем в экономике и управлении",
                vk: 182,
                kafedras: [{
                    title: "Информационных систем в экономике",
                    vk: 2815
                }]
            }]
        });
        univer.save(function (err, univer) {
            var univerId = univer._id,
                facId = univer.facultets[0]._id,
                kafId = univer.facultets[0].kafedras[0]._id;


            Prepod.remove(function(err) {
                var prepod = new Prepod({
                    _univer: univerId,
                    _kafedra: kafId,
                    firstName: 'Михаил',
                    thirdName: 'Михаилович',
                    lastName: 'Галилеев'
                });
                prepod.save(function(err, prepod) {
                    var prepodId = prepod._id;


                    Group.remove(function (err) {
                        var group = new Group({
                            _univer: univerId,
                            _facultet: facId,
                            _kafedra: kafId,
                            title: '371',
                            created: new Date(),
                            endYear: 2013
                        });
                        group.save(function (err, group) {
                            var groupId = group._id;


                            Lesson.remove(function (err) {
                                var lesson = new Lesson({
                                    _group: groupId,
                                    _prepod: prepodId,

                                    week: 0,
                                    day: 1,
                                    time: 0,
                                    dates: [new Date()],

                                    title: 'Математика',
                                    typ: 'Лекция',
                                    audit: '125'
                                });
                                lesson.save(function (err, lesson) {
                                    console.log(lesson);
                                })
                            });
                        });
                    });
                });
            });
        });
    });
    /*
     {
     title: "Предпринимательства и финансов",
     vk: 180
     }, {
     title: "Права и экономической безопасности",
     vk: 181
     }, {
     title: "Вычислительных систем и программирования",
     vk: 2816
     }, {
     title: "Высшей математики",
     vk: 2817
     }, {
     title: "Исследования операций в экономике",
     vk: 29016
     }],
     vk: 182
     }, {
     title: "Экономики и управления в машиностроении",
     vk: 183
     }, {
     title: "Логистики и транспорта (бывш. ФЭУТ)",
     vk: 184
     }, {
     title: "Экономики и управления в химической промышленности и природопользовании",
     vk: 185
     }, {
     title: "Региональной экономики и управления",
     vk: 186
     }, {
     title: "Туризма и гостиничного хозяйства",
     vk: 187
     }, {
     title: "Гуманитарный",
     vk: 188
     }, {
     title: "Менеджмента",
     vk: 82183
     }, {
     title: "Президентская программа",
     vk: 87332
     }, {
     title: "Институт делового администрирования (бывш. ИПК)",
     vk: 360193
     }, {
     title: "MBA",
     vk: 777204
     }, {
     title: "Высшая школа экономики и менеджмента",
     vk: 2091315
     }, {
     title: "Институт инновационного менеджмента",
     vk: 2130121
     }, {
     title: "Медиаиндустрии",
     vk: 2138529
     }
     */
};
createStruct();

app.get('/', routes.index);
app.get('/univer', function (req, res) {
    Univer.find({}, function(err, univers) {
        res.contentType('json');
        res.json({
            success: true,
            data: univers
        });
    });
});
app.get('/groups', function (req, res) {
    var facId = req.query._facultet;
    Group.find({_facultet: facId }, function(err, groups) {
        res.contentType('json');
        res.json({
            success: true,
            data: groups
        });
    });
});
app.get('/lessons', function (req, res) {
    var groupId = req.query._group;
    Lesson.find({_group: groupId}, function(err, lessons) {
        res.contentType('json');
        res.json({
            success: true,
            data: lessons
        });
    });
});
app.get('/prepods', function (req, res) {
    var univerId = req.query._univer;
    Prepod.find({_univer: univerId}, function(err, prepods) {
        res.contentType('json');
        res.json({
            success: true,
            data: prepods
        });
    });
});

app.put('/lessons/:id', function(req, res) {
    var scheduleId = req.query._schedule,
        lessonId = req.params.id,
        lessonBody = req.body;

    if(!scheduleId) {
        res.contentType('json');
        res.json({
            success: false
        });
        return;
    }


    Schedule.findById(scheduleId, function(err, schedule) {
        err && console.log(err);
        console.log(schedule)

        var les = schedule.lessons.id(lessonId);
        les.set(lessonBody);

        schedule.save(function(err) {
            res.contentType('json');
            res.json({
                success: true
            });
        });

    });
});
app.post('/lessons', function(req, res) {
    var scheduleId = req.query._schedule,
        lessonBody = req.body;

    if(!scheduleId) {
        res.contentType('json');
        res.json({
            success: false
        });
        return;
    }

    delete lessonBody['_id'];

    Schedule.findById(scheduleId, function(err, schedule) {
        err && console.log(err);

        console.log(lessonBody)
        schedule.lessons.push(lessonBody);
        var added = schedule.lessons[0];

        schedule.save(function(err, schedule) {
            res.contentType('json');
            res.json({
                success: true,
                data: added
            });
        });

    });

});
app.del('/lessons/:id', function(req, res) {
    var scheduleId = req.query._schedule,
        lessonId = req.params.id;

    if(!scheduleId || !lessonId) {
        res.contentType('json');
        res.json({
            success: false
        });
        return;
    }

    Schedule.findById(scheduleId, function(err, schedule) {
        err && console.log(err);

        schedule.lessons.id(lessonId).remove();

        schedule.save(function(err) {
            console.log(schedule.lessons)
            res.contentType('json');
            res.json({
                success: true
            });
        });

    });
});

var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function(){
  console.log("Express server listening on port " + app.get('port'));
});
