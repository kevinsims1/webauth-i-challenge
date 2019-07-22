const express = require('express');
const bcrypt = require('bcryptjs')

const db = require('./database/dbConfig.js');
const Users = require('./users/user-model.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send("It's alive!");
  });

server.post('/api/register', (req,res) => {
    let newUser = req.body
    const hash = bcrypt.hashSync(newUser.password, 14)
    newUser.password = hash

    Users.add(newUser)
        .then(savedUser => {
            res.status(201).json(savedUser)
        })
        .catch(error => {
            res.status(500).json(error);
          });
})

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `${user.username} is logged in!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  server.get('/api/users', authenticate, (req, res) => {
    Users.find()
    .first()
    .then(users => {
    res.json(users);
    }) 
    .catch(err => res.send(err));
})

function authenticate(req,res,next){
    const { username, password } = req.headers;
  
    Users.findBy({username})
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)){
        next()
      } else {
        res.status(401).json({message: "You shall not pass"})
      }
    })
    .catch(() => {
      res.status(500).json({message: "ERROR"})
    })
  }

  const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));