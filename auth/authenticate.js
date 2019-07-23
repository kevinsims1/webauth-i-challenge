const bcrypt = require('bcryptjs'); /// <<<<<< install it and require it

const Users = require('../users/user-model.js');

module.exports = authenticate;

function authenticate(req, res, next) {

  if(req.session && req.session.username) {
    next()
  } else {
    res.status(401).json({ message: 'Invalid Creds' }); 
  }
  // const { username, password } = req.headers;

  // find the users in the DB
  // Users.findBy({ username })
  //   .then(user => {
  //     if (user && bcrypt.compareSync(password, user.password)) {
  //       next(); // pressing the button to let the request continue
  //     } else {
  //       res.status(401).json({ message: 'You shall not pass!!' });
  //     }
  //   })
  //   .catch(error => {
  //     res.status(500).json(error);
  //   });
}