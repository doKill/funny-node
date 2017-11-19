let app = require("express")(),
    url = require("url"),
    async = require("async"),
    cheerio = require("cheerio"),
    request = require("request"),
    targetURLs = [];


//拿到所有url
let basicUrl = "https://cnodejs.org";
request(basicUrl, (err, response, body) => {
    if (response && response.statusCode == 200) {
        $ = cheerio.load(body);
        $('.topic_title_wrapper .topic_title').each((index, ele) => {
            let $ele = $(ele),
                link = url.resolve(basicUrl, $ele.attr('href'))
            targetURLs.push(link);
        });
    } else {
        console.log(err)
    }
})

// async.mapLimit的参数函数
let fetchContent = (url, callback) => {
    request(url, (err, response, body) => {
        if (response && response.statusCode == 200) {
            $ = cheerio.load(body);
            let c = $('.reply_highlight').eq(0).text().trim();
            _result = {
                title: $('.topic_full_title').text().trim(),
                date: $('.changes span').eq(0).text().trim(),
                comment: c == "" ? "无评论内容" : c
            }
            callback(null, _result)
        } else {
            console.log(err)
        }
    })
};

app.get('/', (req, res) => {
    async.mapLimit(targetURLs, 5, (url, cb) => {
        fetchContent(url, cb);
    }, (err, result) => {
        res.send({
            message: 'success',
            code: 1,
            data: result
        })
    })
});

app.listen(3000, () => {
    console.log('listening at port 3000');
})