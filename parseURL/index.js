// parse url
var parseURL = function() {
    var cache = {};
    return function(url) {
        if (!cache[url]) {
            var a = document.createElement('a');
            a.href = url ? url : window.location.href;
            cache[url] = {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function() {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }
        return cache[url];
    };
}();


function replaceParamVal(paramName, replaceWith) {
    var oUrl = location.href.toString(),
        value = paramName + '=' + replaceWith,
        nUrl;
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    if (re.test(oUrl)) {
        nUrl = oUrl.replace(re, value);
    } else {
        var mosaicSymbol = oUrl.indexOf('?') > -1 ? '&' : '?';
        nUrl = oUrl + mosaicSymbol + value;
    }
    return nUrl;
};