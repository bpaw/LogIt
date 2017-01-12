var fs = require('fs')
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

/* GET statistics page */
router.get('/statistics', function(req, res, next) {
	res.render('statistics', { title: 'statistics' });
});

/* GET calendar page */
router.get('/calendar', function(req, res, next) {
	res.render('calendar', { title: 'calendar' });
});

/* GET checklist page */
router.get('/checklist', function(req, res, next) {
	res.render('checklist', { title: 'placeholder'});
});

/* GET placeholder page */
router.get('/placeholder', function(req, res, next) {
	res.render('placeholder', { title: 'placeholder'});
});

/* POST addNewLog route for updating datafile */
/*router.post('/addNewLog', function(req, res, next) {

});*/

module.exports = router;
