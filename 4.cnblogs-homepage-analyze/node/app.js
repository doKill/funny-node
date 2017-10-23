var express = require('express'),
    cheerio = require('cheerio'),
    superagent = require('superagent'),
    eventproxy = require('eventproxy'),
    ep = new eventproxy(),
    app = express();


app.get('/getInfo', function(req, res) {

    var api = 'http://www.cnblogs.com/mvc/AggSite/PostList.aspx',
        start = 1,
        num = 100,
        config = {
            "CategoryType": "SiteHome",
            "ParentCategoryId": 0,
            "CategoryId": 808,
            "ItemListActionName": "PostList"
        };

    ep.after('receiveData', num, function(data) {
        var answer = [];
        for (var i = 0, len = data.length; i < len; i++)
            Array.prototype.push.apply(answer, data[i]); //这一句不理解
        res.jsonp(answer);       //express的默认jsonp关键字为‘callback’
    });


    for (var i = start; i < start + num; i++) {
        config.PageIndex = i;
        superagent.post(api).send(config).end(function(err, res) {
            var $ = cheerio.load(res.text),
                data = [];

            $('.post_item_foot').each(function(index, ele) {
                var $ele = $(ele),
                    time = $ele.contents().eq(2).text().replace(/[^0-9]/ig, "").substring(8, 10),
                    views = $ele.find('.article_view').text().replace(/[^0-9]/ig, "");
                data.push({
                    time: parseInt(time),
                    views: parseInt(views)
                })
            });
            ep.emit('receiveData', data);
        });
    };

});


app.listen(3000, function() {
    console.log('app is running~');
})