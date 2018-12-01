;
(function (doc) {
    var Paganation = function (el, options) {
        this.el = el;
        let baseOptions = Object.assign({
            baseUrl: "/",
            curPage: 1,
            totalPage: 100,
            arrow: true,
            prev: '',
            next: '',
            showLen: 10
        }, options);

        this._init(baseOptions);
    };

    Paganation.prototype = {
        contructor: Paganation,
        _analysisOptions: function (options) {
            for (let k in options) {
                this[k] = options[k];
            }
        },

        _init: function (options) {
            this._analysisOptions(options);
            this._render();
        },

        _arrowShow: function () {
            const prevUrl = this.curPage == 1 ? 'javascript:void(0);' : this.baseUrl + (this.curPage - 1);
            const nextUrl = this.curPage == this.totalPage ? 'javascript:void(0);' : this.baseUrl + (+this.curPage + 1);

            this.prev = '<a href="' + prevUrl + '">上一页</a>';
            this.next = '<a href="' + nextUrl + '">下一页</a>';
        },

        _render: function () {
            let str = '';
            let self = this;
            let showLen = this.showLen;
            let totalPage = this.totalPage;
            let curPage = this.curPage;
            const centerStr = '<span>...</span>';
            let urlFn = function (i) {
                return self.baseUrl + i;
            };
            let htmlStr = function (i) {
                return '<a href="' + urlFn(i) + '">' + i + '</a>';
            };

            if (showLen >= totalPage) {
                for (let i = 1; i <= totalPage; i++) {
                    str += htmlStr(i)
                }
            } else {
                if (this.arrow) this._arrowShow();
                if (curPage <= totalPage - showLen + 1) { //头部
                    for (let i = 0; i < showLen - 1; i++) {
                        str += htmlStr(+curPage + i);
                    }
                    str += centerStr + htmlStr(totalPage);
                } else { // 尾部
                    for (let i = 1; i <= showLen; i++) {
                        str += htmlStr(totalPage - showLen + i);
                    }
                }
            }

            this.el.innerHTML = this.prev + str + this.next;
        }
    }

    window.Paganation = Paganation;
})(document);


var parseURL = function () {
    var cache = {};
    return function (url) {
        if (!cache[url]) {
            var a = document.createElement('a');
            a.href = url ? url : window.location.href;
            cache[url] = {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
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


new Paganation(document.querySelector('.page-container'), {
    baseUrl: "?page=",
    curPage: parseURL().params.page,
    totalPage: 100
})