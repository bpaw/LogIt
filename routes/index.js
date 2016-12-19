var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('webpage', { title: 'LogIt' });
});

/* GET logging page */
router.get('/Log', function(req, res, next) {
  res.render('Log', { title: 'Log' });
});

/* GET placeholder page */
router.get('/placeholder', function(req, res, next) {
	res.render('placeholder', { title: 'placeholder'});
});

module.exports = router;
