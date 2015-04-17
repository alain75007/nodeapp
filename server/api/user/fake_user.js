var User = require('./user.model');
var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});
 module.exports = user;

