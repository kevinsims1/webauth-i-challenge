const router = require('express').Router();
const bcrypt = require('bcryptjs');
const session = require('express-session')

const Users = require('../users/user-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req,res) => {
    let newUser = req.body
    const hash = bcrypt.hashSync(newUser.password, 14)
    newUser.password = hash
    if(newUser.username && newUser.password) {
        Users.findBy({username: newUser.username})
            .then(user=> {
                console.log(user)
                if(user){
                    res.status(409).json({message: 'USERNAME ALREADY TAKEN'})
                } else {
                Users.add(newUser)
                .then(savedUser => {
                    res.status(201).json(savedUser)
                })
                .catch(error => {
                    res.status(500).json(error);
                });
                }
            })
            .catch(error => {
                res.status(500).json(error);
            });
    } else {
            res.status(400).json({message: "ERROR STRING CANT BE EMPTY"})
    }
    
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;

        res.status(200).json({
          message: `Welcome ${user.username}!`,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
  });

router.get('/logout', (req,res) => {
  if(req.session){
    req.session.destroy(err => {
      if(err){
        res.status(500).json({message: 'ERROR'})
      } else {
        res.status(200).json({message: 'BYE'})
      }
    })
  } else {
    res.status(200).json({message: 'ok, bye'})
  }
})

module.exports = router;