var express = require("express");
var router = express.Router();
var storage = require("../util/storage");
var cookieParser = require("cookie-parser");

/* GET home page. */
router.get("/", function(req, res, next) {
	console.log(storage);
	res.render("index", { title: "Express" });
});

router.get("/newID", function(req, res) {
	var hosturl = req.get("host");

	var id = storage.createID();
	var newGifLink = `${hosturl}/${id}/gif.gif`;
	res.render("newID", {
		id: id,
		gifLink: newGifLink
	});
	// res.cookie('userid', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

});

router.get("/:id/gif.gif", function(req, res) {

	// if you don't have an ID or if your ID doesn't match the link owner, log data.
	if (!req.cookies.userid || req.cookies.userid !== req.params.id) {
		storage.log(req.params.id, {
			ip: req.ip,
			useragent: req.get("user-agent"),
			date: new Date()
		});
	}

	var log = storage.getUserLog(req.params.id);
	res.json({
		views: log.length,
		log: log
	});
});

router.get("/:id", function(req, res) {
	var log = storage.getUserLog(req.params.id);
	res.json({
		views: log.length,
		log: log
	});
});

module.exports = router;
