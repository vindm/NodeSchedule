var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// ----------- Univer Model ------------

var KafSchema = new Schema({
        title: String,
        vk: Number
    }),
    FacSchema = new Schema({
        title: String,
        vk: Number,
        kafedras: [KafSchema]
    }),
    UniverSchema = new Schema({
        title: String,
        vk: Number,
        facultets: [FacSchema]
    });
mongoose.model('Univer', UniverSchema);



// ----------- Group Model ------------

var AdminSchema = new Schema({
        title: String,
        vk: Number,
        author: Boolean
    }),
    GroupSchema = new Schema({
        _univer: { type: Schema.Types.ObjectId, ref: 'Univer' },
        _facultet: { type: Schema.Types.ObjectId },
        _kafedra: { type: Schema.Types.ObjectId },
        title: String,
        endYear: Number,
        created: { type: Date, default: Date.now }
    });
mongoose.model('Group', GroupSchema);



// ----------- Prepod Model ------------

var PrepodSchema = new Schema({
    _univer: { type: Schema.Types.ObjectId, ref: 'Univer' },
    _kafedra: { type: Schema.Types.ObjectId },
    firstName: String,
    lastName: String,
    thirdName: String,
    vkProfile: String,
    imageLink: String
});
mongoose.model('Prepod', PrepodSchema);



// ----------- Schedule Model ------------

var SchedSchema = new Schema({
    _univer: { type: Schema.Types.ObjectId, ref: 'Univer' },
    _facultet: { type: Schema.Types.ObjectId },
    weeks: Number
});
mongoose.model('Schedule', SchedSchema);



// ----------- Lesson Model ------------

var LessonSchema = new Schema({
    _group: { type: Schema.Types.ObjectId, ref: 'Group' },

    title:      String,
    typ:        String,

    _subGroup:  Schema.Types.ObjectId,
    subIndex:   { type: Number, default: 0 },
    subChar:    { type: String, default: 'А' },

    time:       Number,
    day:        Number,
    dates:      [Date],

    audit:      String,

    _prepod:    { type: Schema.Types.ObjectId, ref: 'Prepod' }
});
mongoose.model('Lesson', LessonSchema);




exports.models = function(db) {
    return {
        Univer: db.model('Univer'),
        Group:  db.model('Group'),
        Prepod: db.model('Prepod'),
        Lesson: db.model('Lesson')
    };
};