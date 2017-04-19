var express = require("express");
var router = express.Router();
var storage = require("../util/storage");
var cookieParser = require("cookie-parser");

/* GET home page. */
// router.get("/", function(req, res, next) {
// 	console.log(storage);
// 	res.render("index", { title: "Express" });
// });

router.get("/", function(req, res) {
	var fullUrl = req.protocol + '://' + req.get('host');
	var id = storage.createID();

	res.cookie('userid', id, { expires: new Date(Date.now() + 900000), httpOnly: true });

	res.render("newID", {
		id: id,
		trackingURL: `${fullUrl}/${id}`,
		gifLink: `${fullUrl}/${id}/gif.gif`,
		setURL: `${fullUrl}/set/${id}`
	});
});

router.get("/:id/gif.gif", function(req, res) {
	var logged = false;
	// if you don't have an ID or if your ID doesn't match the link owner, log data.
	if (!req.cookies.userid || req.cookies.userid !== req.params.id) {
		storage.log(req.params.id, {
			ip: req.ip,
			useragent: req.get("user-agent"),
			date: new Date()
		});
		logged = true;
	}

	var log = storage.getUserLog(req.params.id);
	// res.json({
	// 	views: log.length,
	// 	log: log
	// }); //TODO: should send a pixel gif
	var buf = new Buffer([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 
    0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c, 
    0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 
    0x02, 0x44, 0x01, 0x00, 0x3b]);

	res.writeHead(200, {'Content-Type': 'image/gif' });
	res.end(buf, 'binary');
});

router.get("/:id", function(req, res) {
	var log = storage.getUserLog(req.params.id);

	// res.json({
	// 	yourCookieID: req.cookies.userid,
	// 	views: log.length,
	// 	log: log
	// });
	console.log(log);
	res.render('tracking', {
		cookieID: req.cookies.userid,
		views: log.length,
		log: log
	});
});

router.get("/set/:id", function(req, res) {
	// set cookie
	res.cookie('userid', req.params.id, { expires: new Date(Date.now() + 900000), httpOnly: true });
	var fullURL = req.protocol + '://' + req.get('host');

	res.send(`Your ID has been set to: ${req.params.id}.
		<br/>
		Any browser that visits this page will not be tracked.
		<br/>
		Visit <a href=${fullURL}/${req.params.id}>${fullURL}/${req.params.id}</a> to see who read your emails.
		`);
});

module.exports = router;
