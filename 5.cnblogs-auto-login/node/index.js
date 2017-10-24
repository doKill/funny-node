var express = require("express"),
    bodyParser = require('body-parser'),
    superagent = require('superagent'),
    app = express(),
    myCookie,
    VerificationTokenValue,
    input1,
    input2;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.all("/login", function(request, response) {
    var req_obj = request.body;

    //这里就不做校验了
    input1 = req_obj.name;
    input2 = req_obj.psd;

    goLogIn();
});

function goLogIn(response) {
    superagent
        .get('http://passport.cnblogs.com/user/signin?ReturnUrl=http://passport.cnblogs.com/')
        .end(function(err, result) {

            var str = result.text,
                pattern = /'VerificationToken': '(.*)'/,
                tmpArr = str.match(pattern);

            /************
             *
             *	由于cnblogs改变登录方式,此方法失效~
             *	后续所有代码都执行不了了,此处仅提供思路参考~
             *  
             *
             ***********/
            VerificationTokenValue = tmpArr[1];
            response.end();
            logIn();
        });
};

function logIn() {
    superagent
        // 登录 url
        .post('http://passport.cnblogs.com/user/signin')
        // post 用户名 & 密码
        .send({ "input1": input1 })
        .send({ "input2": input2 })
        .send({ "remember": "false" })
        .set("Content-Type", "application/json; charset=UTF-8")
        .set("VerificationToken", VerificationTokenValue)
        .set("Cookie", "AspxAutoDetectCookieSupport=1;")
        .set("X-Requested-With", "XMLHttpRequest")
        .end(function(err, result) {
            if (err) {
                return console.log(err)
            }
            var str = result.header['set-cookie'][0];
            var pos = str.indexOf(';');

            // 后续操作所需要的 cookie
            myCookie = str.substr(0, pos);

            // 后续操作:如回帖
            doSomething();
        });
};

function doSomething() {
    // http://www.cnblogs.com/zichi/p/5331426.html
    var content = 'good boy!';

    superagent
        .post('http://www.cnblogs.com/mvc/PostComment/Add.aspx')
        .set("Cookie", myCookie)
        .send({ "blogApp": "zichi" })
        .send({ "body": content })
        .send({ "postId": 5331426 })
        .end(function(err, sres) {
            console.log(err)
        })
}

app.listen(3000, function() {
    console.log("listen at port 3000");
})