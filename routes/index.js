var fs = require('fs')
var express = require('express');
var router = express.Router();

/*
exports.homepage = function(req, res) {
	res.render('webpage', { title: 'LogIt'});
};

exports.Log = function(req, res) {
	res.render('Log', { title: 'Log' });
}
*/

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

/* POST addNewLog route for updating datafile */
/*router.post('/addNewLog', function(req, res, next) {

});*/

module.exports = router;
