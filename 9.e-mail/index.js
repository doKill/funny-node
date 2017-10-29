var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "qq",
    secure: true, // 使用 SSL
    auth: {
        user: "updowner@qq.com",
        pass: "**" // 授权码，看 README
    }
});

var mailOptions = {
    from: 'updowner@qq.com', // sender address，和 transporter 中的配置保持一致
    to: 'fun**@gmail.com, 371**30@qq.com', // 邮件接收者，可以同时发送多个，逗号分隔
    subject: '邮件标题', // Subject line 
    text: '文本', // plaintext body 
    html: `<h1>你是不是傻</h1>` // html body，当有 html 参数时会忽略 text 参数
};

// send mail with defined transport object 
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});