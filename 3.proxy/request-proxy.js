let request = require("request"),
    Iconv = require("iconv-lite");

let getProxyList = () => {
    let api = "http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1";

    return new Promise((resolve, reject) => {
        request(api, (err, response, body) => {
            if (response && response.statusCode == 200) {

                //将原网页gb2312转为gbk编码并提取ip为数组形式
                body = Iconv.decode(body, 'gbk').match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g)
                resolve(body)
            } else {
                reject(err)
            }
        });
    })

};

getProxyList().then((ipList) => {

    let crawl = (index) => {
        let config = {
            // url: 'https://www.taobao.com',
            url: 'http://movie.mtime.com/comingsoon/#hottest',
            timeout: 8000,
            head: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
                'Connection': 'keep-alive'
            }
        };

        // config.proxy = `https://${ipList[index]}`
        request(config, (err, response, body) => {
            console.log(config)
            if (response && response.statusCode == 200) {
                console.log(body)
                return
            } else {
                crawl(index+1)
            }
        })
    }
    crawl(0)

}).catch((err) => {
    console.log(err)
});
