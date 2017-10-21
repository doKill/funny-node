var express = require("express"),
	cheerio = require("cheerio"),
	superagent = require("superagent"),
	app = express(),
	url = "http://www.uisdc.com/";  //优设

app.get('/',function(req,res,next){
	superagent.get(url).end(function(err,result){

		if(err) return next(err);
		var $ = cheerio.load(result.text),
			list = "";

		$("h2.entry-title a").each(function(index,item){
			var $item = $(item);
			list += $item.html() + "<br/><br/>";
		});

		res.send(list);
	});
});

app.listen(3000,function(){
	console.log("app is running~")
});