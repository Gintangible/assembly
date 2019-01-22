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
            arrow: true,
            data: '',
            showDataCount: 1,
            showLen: 10,
            cur: 'cur'
        }, options);

        this.el = el;
        this.dataAry = [];
        this.curIndex = 0;

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
            const _this = this;
            this._analysisOptions(options);

            this._dataParse(this.data, function () {
                _this._render(0);
            });
        },

        _dataParse: function (data, callback) {
            const showDataCount = this.showDataCount;
            const pageCount = Math.ceil(data.length / showDataCount);
            for (let i = 0; i < pageCount; i++) {
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
            this._pageRender(index);
            this._contentRender(index);
        },

        _contentRender: function (index) {
            var item = this.dataAry[index],
                node = item.element;
            if (!node) {
                if (typeof this._contentFormat !== 'function') {
                    throw new Error(`_contentFormat必须是一个function`);
                }
                node = this._contentFormat(item.data);
                item.element = node;
            }

            if (typeof this._contentShow !== 'function') {
                throw new Error(`_contentShow必须是一个function`);
            }

            this._contentShow(node);
        },
        _contentFormat: function (data) {
            let str = '';
            data.forEach((item, index) => {
                str += '<div>' + item + '</div>'
            })
            return str;
        },

        _contentShow: function (node) {
            // 此处为内容渲染的函数
            console.log(`you must set you _contentShow function`);
            doc.querySelector('.page-content').innerHTML = node;
        },

        _pageHtmlStr: function (i) {
            const isCur = i === this.curPage ? this.cur : '';
            return `<span data-page="${i}" class="${isCur}">${(i + 1)}</span>`;
        },

        _pageRender: function (index) {
            let htmlStr = '';
            const showLen = this.showLen;
            const totalPage = this.dataAry.length;
            const curPage = index;
            const centerStr = `<span>...</span>`;
            if (showLen >= totalPage) {
                for (let i = 0; i < totalPage; i++) {
                    htmlStr += this._pageHtmlStr(i);
                }
            } else {
                if (curPage <= totalPage - showLen) { //头部
                    for (let i = 0; i < showLen - 1; i++) {
                        htmlStr += this._pageHtmlStr(+curPage + i);
                    }
                    htmlStr += centerStr + this._pageHtmlStr(totalPage - 1);
                } else { // 尾部
                    for (let i = 0; i < showLen; i++) {
                        htmlStr += this._pageHtmlStr(totalPage - showLen + i);
                    }
                }
                if (this.arrow) {
                    const prev = `<span data-page="${(curPage <= 0 ? 0 : (curPage - 1))}">上一页</span>`;
                    const next = `<span data-page="${curPage >= totalPage - 1 ? totalPage - 1 : (+curPage + 1)}">下一页</span>`;
                    htmlStr = prev + htmlStr + next;
                };
            }

            this.el.innerHTML = htmlStr;
            this._bindEvent();
        },

        _bindEvent: function () {
            const spans = this.el.querySelectorAll('span');
            const _this = this;

            spans.forEach(item => {
                item.addEventListener('click', function () {
                    const index = this.getAttribute('data-page');
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

// 根据接口数据在分页
new Paganation(document.querySelector('.page-container'), {
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    showDataCount: 1
})