const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$7ZP.8B90x8WxhRdXPvOcDOqTweVDVIT1Pm1/Gz2HV8f21RVwleRPa';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

/*var data = { id: 10 };

var token = jwt.sign(data, '123abc');

console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);*/

/*var message = 'Hello world !';
var hash = SHA256(message).toString();

console.log(message, '=', hash);

var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'salt').toString()
};

// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString();


var resHash = SHA256(JSON.stringify(token.data) + 'salt').toString();

if (resHash === token.hash) {
    console.log('Data not changed');
} else {
    console.log('Data changed');
}*/