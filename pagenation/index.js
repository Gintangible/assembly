;
(function (doc) {
    var Paganation = function (el, options) {
        /*
         * curIndex      number  当前页(*)
         * dataAry       number  分页数组
         * data          array   需分页的数据
         * showDataCount number  每页显示数
         * arrow         boolean 是否有上下页
         * showLen       number  显示的按钮个数
         * cur           string  按钮激活类名
         */
        let baseOptions = Object.assign({
            data: [],
            showDataCount: 10,
            curPage: 0,
            isArrow: true,
            showNum: 5,
            prefix: 'page-',
            disabledClass: 'page-disabled',
            isTail: true,
            pageDetail: true,
            isShowInfo: false,
            ellipsisClass: ''
        }, options);

        this.el = el;
        this.dataAry = [];

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
            var _this = this;
            this._analysisOptions(options);

            this._dataParse(this.data, function () {
                _this._render(0);
            });
        },

        _dataParse: function (data, callback) {
            var showDataCount = this.showDataCount;
            var pageCount = this.totalPage = Math.ceil(data.length / showDataCount);
            for (var i = 0; i < pageCount; i++) {
                this.dataAry.push({
                    page: i,
                    data: data.slice(showDataCount * i, showDataCount * (i + 1))
                });
            }

            callback && callback();
        },

        // 页面内容改变时变化
        _render: function (index) {
            // index 为当前页
            this.curPage = +index;
            this._contentRender(index);
            this._pageRender();
        },

        _contentRender: function (index) {
            var item = this.dataAry[index],
                node = item.element;
            if (!node) {
                if (typeof this._contentFormat !== 'function') {
                    throw new Error('_contentFormat必须是一个function');
                }
                node = this._contentFormat(item.data);
                item.element = node;
            }
            if (typeof this._contentShow !== 'function') {
                throw new Error('_contentShow必须是一个function');
            }

            this._contentShow(node);
        },
        _contentFormat: function (data) {
            var str = '';
            data.forEach((item, index) => {
                str += '<div>' + item + '</div>'
            })
            return str;
        },

        _contentShow: function (node, content, callback) {
            // 此处为内容渲染的函数
            console.log('you must set you _contentShow function');
            var content = content || doc.querySelector('.page-content');
            if (content) {
                content.innerHTML = node;
            }

            callback && callback();
        },

        // set html
        _create: function () {
            this.curPage = +this.curPage;
            this.totalPage = +this.totalPage;
            if (this.curPage < 0) this.curPage = 0;
            if (this.curPage > this.totalPage - 1) this.curPage = this.totalPage - 1;
            if (this.isArrow) this._createArrow();
            if (this.isTail) this._createTail();
            if (this.isShowInfo) this._createInfo();
            if (this.pageDetail) this._createPage();
        },

        // 上下页
        _createArrow: function () {
            const disabledClass = this.disabledClass;
            const prevPage = this.curPage - 1;
            const nextPage = +this.curPage + 1;
            const prevDisabled = prevPage < 0 ? disabledClass : '';
            const nextDisabled = nextPage > this.totalPage - 1 ? disabledClass : '';

            this.prevHTML = '<span class="' + this.prefix + 'item ' + prevDisabled + '" data-page="' + prevPage + '">上一页</span>';
            this.nextHTML = '<span class="' + this.prefix + 'item ' + nextDisabled + '" data-page="' + nextPage + '">下一页</span>';
        },

        // 首尾页
        _createTail: function () {
            const disabledClass = this.disabledClass;
            const startPage = 0;
            const endPage = this.totalPage - 1;
            const startDisabled = this.curPage == 0 ? disabledClass : '';
            const endDisabled = this.curPage == this.totalPage - 1 ? disabledClass : '';
            this.startHTML = '<span class="' + this.prefix + 'item ' + startDisabled + '" data-page="' + startPage + '">首页</span>';
            this.endHTML = '<span class="' + this.prefix + 'item ' + endDisabled + '" data-page="' + endPage + '">尾页</span>';
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

            let htmlStr = function (i) {
                const endabled = self.curPage == i ? self.disabledClass : '';
                return '<span data-page="' + i + '" class="' + endabled + '">' + (i + 1) + '</span>';
            };

            if (showNum >= totalPage) {
                for (let i = 0; i < totalPage; i++) {
                    str += htmlStr(i)
                }
            } else {
                if (curPage < totalPage - showNum + 1) { //头部
                    for (let i = 0; i < showNum - 1; i++) {
                        str += htmlStr(+curPage + i);
                    }
                    str += centerStr + htmlStr(totalPage - 1);
                } else { // 尾部
                    for (let i = 0; i < showNum; i++) {
                        str += htmlStr(totalPage - showNum + i);
                    }
                }
            }

            this.pageHTML = str;
        },

        _pageRender: function () {
            this._create();
            this.el.innerHTML = this.infoHTML + this.startHTML + this.prevHTML + this.pageHTML + this.nextHTML + this.endHTML;
            this._bindEvent();
        },

        _bindEvent: function () {
            const spans = this.el.querySelectorAll('span');
            const _this = this;

            spans.forEach(item => {
                item.addEventListener('click', function () {
                    const index = this.getAttribute('data-page');
                    if (this.className.indexOf(_this.disabledClass) > -1) return;
                    _this._refresh(index);
                });
            });
        },

        _refresh: function (index) {
            this._render(index);
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