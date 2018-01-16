var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');

// show login form 
router.get('/login', function (req, res) {
  let flashMsg = req.flash('loginMessage');
  if (flashMsg.length > 0) {
    res.render('login', {
      message: flashMsg
    });
  } else {
    res.render('login');
  }

});


//process the login form
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/users/login',
  failureFlash: true // allow flash messages
}));

// show signup form 
router.get('/signup', function (req, res) {
  res.render('signup');
});

// process the signup form
router.post('/signup', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render('signup', {
      errors: errors
    });
  } else {
    User.findOne({
      'email': email
    }, function (err, user) {
      if (err) throw err;
      if (user) {
        res.render('signup', {
          errors: [{
            'msg': 'This email already taken.'
          }]
        });
      } else {
        var newUser = new User({
          name: name,
          email: email,
          username: username,
        });
        newUser.password = newUser.generateHash(password);
        console.log(newUser);
        newUser.save(function (err) {
          if (err) {
            throw err;
          }
          res.redirect('/profile');
        });
      }
    });

  }

});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;