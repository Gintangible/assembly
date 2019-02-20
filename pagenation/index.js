;
(function (doc) {
    var Paganation = function (el, options) {
        /*
         * baseUrl          string      跳转链接(*)
         * curPage          number      当前页(*) 从1开始
         * totalPage        number      总页数(*)
         * arrow            boolean     是否有上下页
         * showLen          number      显示的按钮个数
         * pageDetail       boolean     是否显示具体的页码
         * isTail           boolean     首尾页
         * isShowInfo       boolean     是否显示页数详情
         * ellipsisClass    string      省略号类名
         * prefix           string      按钮类名前缀
         */

        this.el = el;
        let baseOptions = Object.assign({
            baseUrl: null,
            curPage: 1,
            totalPage: 100,
            isArrow: true,
            showNum: 10,
            prefix: 'page-',
            disabledClass: 'page-disabled',
            isTail: true,
            pageDetail: true,
            isShowInfo: true,
            ellipsisClass: ''
        }, options);

        /*
         * prev     string      上一页
         * next     string      下一页
         * start    string      首页
         * end      string      尾页
         * page     strign      具体的页码
         * info     string      页码详情
         */
        this.prevHTML = '';
        this.nextHTML = '';
        this.startHTML = '';
        this.endHTML = '';
        this.pageHTML = ''
        this.infoHTML = '';

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

            if (!this.baseUrl) {
                throw new Error(`must set baseUrl`);
            }

            if (!this.el) {
                throw new Error(`must set a page container`);
            };

            this._render();
        },

        // set html
        _create: function () {
            if (this.curPage < 1) this.curPage = 1;
            if (this.curPage > this.totalPage) this.curPage = this.totalPage;
            if (this.isArrow) this._createArrow();
            if (this.isTail) this._createTail();
            if (this.isShowInfo) this._createInfo();
            if (this.pageDetail) this._createPage();
        },

        // 上下页
        _createArrow: function () {
            const disabledClass = this.disabledClass;
            const prevUrl = this.curPage == 1 ? 'javascript:void(0);' : this.baseUrl + (this.curPage - 1);
            const nextUrl = this.curPage == this.totalPage ? 'javascript:void(0);' : this.baseUrl + (+this.curPage + 1);
            const prevDisabled = this.curPage == 1 ? disabledClass : '';
            const nextDisabled = this.curPage == this.totalPage ? disabledClass : '';

            this.prevHTML = '<a class="' + this.prefix + 'item ' + prevDisabled + '" href="' + prevUrl + '">上一页</a>';
            this.nextHTML = '<a class="' + this.prefix + 'item ' + nextDisabled + '" href="' + nextUrl + '">下一页</a>';
        },

        // 首尾页
        _createTail: function () {
            const disabledClass = this.disabledClass;
            const startUrl = this.curPage == 1 ? 'javascript:void(0);' : this.baseUrl + 1;
            const endUrl = this.curPage == this.totalPage ? 'javascript:void(0);' : this.baseUrl + this.totalPage;
            const startDisabled = this.curPage == 1 ? disabledClass : '';
            const endDisabled = this.curPage == this.totalPage ? disabledClass : '';
            this.startHTML = '<a class="' + this.prefix + 'item ' + startDisabled + '" href="' + startUrl + '">首页</a>';
            this.endHTML = '<a class="' + this.prefix + 'item ' + endDisabled + '" href="' + endUrl + '">尾页</a>';
        },

        // 页数详情
        _createInfo: function () {
            this.infoHTML = '<span class="' + this.prefix + 'total">共<i>' + this.totalPage + '</i>页</span><span class="' + this.prefix + 'cur">当前第<i>' + this.curPage + '</i>页</span>'
        },

        // 具体的页码
        _createPage: function () {
            let str = '';
            let self = this;
            let showNum = this.showNum;
            let totalPage = this.totalPage;
            let curPage = this.curPage;
            const prefix = this.prefix;
            const centerStr = '<span class="' + this.ellipsisClass + '">...</span>';

            let urlFn = function (i) {
                return self.baseUrl + i;
            };
            let htmlStr = function (i) {
                const endabled = self.curPage == i ? self.disabledClass : '';
                return '<a class="' + prefix + 'item ' + endabled + '" href="' + urlFn(i) + '">' + i + '</a>';
            };

            if (showNum >= totalPage) {
                for (let i = 1; i <= totalPage; i++) {
                    str += htmlStr(i)
                }
            } else {
                if (curPage < totalPage - showNum + 1) { //头部
                    for (let i = 0; i < showNum - 1; i++) {
                        str += htmlStr(+curPage + i);
                    }
                    str += centerStr + htmlStr(totalPage);
                } else { // 尾部
                    for (let i = 1; i <= showNum; i++) {
                        str += htmlStr(totalPage - showNum + i);
                    }
                }
            }

            this.pageHTML = str;
        },

        _goPage: function (i) {
            this.curPage = i;
            this._render();
        },

        _render: function () {
            this._create();
            this.el.innerHTML = this.infoHTML + this.startHTML + this.prevHTML + this.pageHTML + this.nextHTML + this.endHTML;
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

// 显示数目
new Paganation(document.querySelector('.page-container'), {
    baseUrl: "?page=",
    curPage: parseURL().params.page,
    totalPage: 100
})