
// QZone：
// "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESC}}&summary={{SUMMARY}}&site={{SOURCE}}&pics={{IMAGE}}"
 
// QQ：
// "http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESC}}&pics={{IMAGE}}&summary={{SUMMARY}}"
 
// 新浪微博：
// "http://service.weibo.com/share/mobile.php?url={{URL}}&title={{DESC}}&pic={{IMAGE}}&appkey={{WEIBOKEY}}"


function shareTo(stype, data) {
    var url = data.url || '';
    var title = data.title || '';
    var desc = data.desc || '';
    var pic = data.pic || '';
    //qq空间接口的传参
    if (stype == 'qzone') {
        window.open(
            'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' +
                url +
                '&title=' +
                title +
                '&pics=' +
                pic +
                '&summary=' +
                desc
        );
    }
    //新浪微博接口的传参
    if (stype == 'sina') {
        window.open(
            'http://service.weibo.com/share/share.php?url=' +
                url +
                '&title=' +
                title +
                '&pic=' +
                pic +
                '&appkey='
        );
    }
    //qq好友接口的传参
    if (stype == 'qq') {
        window.open(
            'http://connect.qq.com/widget/shareqq/index.html?url=' +
                url +
                '&title=' +
                title +
                '&pics=' +
                pic +
                '&summary=' +
                desc +
                '&desc=' +
                desc
        );
    }
    //生成二维码给微信扫描分享，php生成，也可以用jquery.qrcode.js插件实现二维码生成
    if (stype == 'wechat') {
        window.open('http://zixuephp.net/inc/qrcode_img.php?url=' + url);
    }

    return false;
}
