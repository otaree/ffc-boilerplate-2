var express = require('express');
var router = express.Router();

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/users/login');
  }
}

/* GET home page. */
router.get('/', isLoggedIn,  function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user});
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile', {user: req.user});
});

module.exports = router;
