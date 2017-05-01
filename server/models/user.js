const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        type: String,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    var access = 'auth';
    var token = jwt.sign({ _id: this._id.toHexString(), access }, 'abc123').toString();
    
    this.tokens.push({ access, token });
    return this.save().then(() => token);
};

UserSchema.methods.toJSON = function () {
    var userObj = this.toObject();
    return _.pick(userObj, ['_id', 'email']);
};

UserSchema.statics.findByToken = function (token) {
    var decoded;
    
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }
    
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = { User };