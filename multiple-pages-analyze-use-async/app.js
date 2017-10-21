var url = require("url"),
    express = require("express"),
    app = express(),
    async = require("async"),
    cheerio = require("cheerio"),
    superagent = require("superagent"),
    basicUrl = "https://cnodejs.org",
    targetUrls = [];

//获取每个页面的链接
superagent.get(basicUrl).end(function(err, res) {
    var $ = cheerio.load(res.text);
    $(".topic_title_wrapper .topic_title").each(function(index, ele) {
        var $ele = $(ele),
            href = url.resolve(basicUrl, $ele.attr('href'));
        targetUrls.push(href);
    });
});

function fetchUrl(url, cb) {
    superagent.get(url).end(function(err, res) {
        var $ = cheerio.load(res.text),
            result = {
                title: $('.topic_full_title').text().trim(),
                comment: $('.reply_content').eq(0).text().trim(),
                author: $('.changes a').text().trim(),
                time: $('.changes span').eq(0).text().trim(),
                views: $('.changes span').eq(2).text().trim(),
                score: $('.big').text().trim(),
                msgtime: $('.reply_item .reply_time').eq(0).text().replace('1楼•','').trim()
            };
        cb(null, result);
    });
};

app.get('/', function(req, res) {
    async.mapLimit(targetUrls, 5, function(url, cb) {  //cb是把每次抓取的数据返回给maplimit第四个参数的result
        fetchUrl(url, cb);
    }, function(err, result) {
        res.send(result)
    })
});

app.listen(3000, function() {
    console.log("app is running~");
})