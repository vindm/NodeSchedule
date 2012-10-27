
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose');

var app = express(),
    db = mongoose.createConnection('localhost', 'test');


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
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function () {
    app.use(express.errorHandler());
});
var Schema = mongoose.Schema;
var groupSchema = new Schema({
        title: String
    }),
    kursSchema = new Schema({
        num: Number,
        groups: [groupSchema]
    }),
    kafSchema = new Schema({
        title: String,
        kursy: [kursSchema]
    }),
    facSchema = new Schema({
        title: String,
        kafedras: [kafSchema]
    }),
    univerSchema = new Schema({
        title: String,
        facultets: [facSchema]
    });

var Univer = db.model('Univer', univerSchema);
Univer.remove({}, function(err){var engec = new Univer({
    title: "ИНЖЭКОН",
    facultets: [{
        title: 'фисэу',
        kafedras: [{
            title: 'прикладная информатика',
            kursy: [{
                num: 4,
                groups: [{
                    title: '371'
                }]
            }, {
                num: 5,
                groups: [{
                    title: '372'
                }]
            }]
        }, {
            title: 'информатика2',
            kursy: [{
                num: 3,
                groups: [{
                    title: '371'
                }]
            }]
        }]
    }, {
        title: 'гумфак',
        kafedras: [{
            title: 'aaaaaaaa',
            kursy: [{
                num: 5,
                groups: [{
                    title: '371'
                }]
            }]
        }]
    }]
});
    engec.save(function (err) {
        console.log('lol '+err)
    });});

app.get('/', routes.index);
app.get('/univer', function (req, res) {
    Univer.find({}, function(err, univers) {
        console.log(univers)
        res.contentType('json');
        res.json({
            success: true,
            univer: univers[0]
        });
    })
});
var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function(){
  console.log("Express server listening on port " + app.get('port'));
});
