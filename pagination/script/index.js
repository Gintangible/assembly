var Pagenation = function (options) {
    // 默认值
    /*
    * parma dataArg        	    array       保存列表数据
    * parma actClassName        string      按钮激活类名
    * parma size                number      默认每页数量 10
    * parma arrowBtn            booble      是否创建上一页下一页
    * parma prevClassName       string      按钮上一页类名
    * parma nextClassName       string      按钮下一页类名
    * parma numBtn              string      数字分页 className
    * parma pageLen             number      页的长度
    * parma renderPageLen       number      渲染的页码长度
    * parma curIndex            number      当前页（数组形式）
    * parma interfacePaging     booble      是否是接口分页
    */
    this.conEl = null;//容器盒子，必须
    this.controlEl = null;//按钮容器
    this.dataAry = [];
    this.pageAry = [];
    this.renderPageLen = 3;
    this.className = {
        actClassName: 'active',
        prevClassName: 'prev',
        nextClassName: 'next'
    };
    this.size = 10;
    this.arrowBtn = true;
    this.numBtn = true;
    this.pagelen = 1;
    this.interfacePaging = false;
    this.curIndex = 0;
    // 获取配置信息
    this._analysisOptions(options);

    // 执行
    this._init();
};

Pagenation.prototype = {
    constructor: Pagenation,

    _analysisOptions: function (options) {
        var _this = this;
        Object.keys(options).forEach(function (k) {
            _this[k] = options[k];
        });
    },

    // 获取数据
    _getData: function (callback) {
        console.log(11)
        // arg1 为传递的数组 arg2为分页数（不是必须，for分页请求）
        throw new Error('must set a _getData function');
    },

    // 执行
    _init: function () {
        var _this = this;

        this._getData(function (dataAry, setLen) {
            console.log(dataAry)
            _this._dataInit(dataAry, setLen);
        })
    },

    // save ary and create
    _dataInit: function (dataAry, setLen) {
        if (setLen) {
            this.interfacePaging = true;
        }
        this.pageLen = setLen || Math.ceil(dataAry.length / this.size);

        this._dataArySave(dataAry);
        this._pageArySave();
        this._create();
        this._render(0);
    },

    // 保存分页数据
    _dataArySave: function (dataAry) {
        if (!this.interfacePaging) {
            var len = this.pageLen,
                size = this.size,
                i = 0;
            for (; i < len; i++) {
                this.dataAry.push(dataAry.slice(size * i, size * (i + 1)));
            }
        } else {
            this.dataAry[this.curIndex] = dataAry;
        }
    },

    // 创建
    _create: function () {
        if (this.numBtn) {
            this._createPageControl();
        }
        if (this.arrowBtn) {
            this._createPrev();
            this._createNext();
        }
    },

    // 页面改变时变化
    _render: function (index) {
        var _this = this;

        // index 为当前页
        this.curIndex = index;
        if (!this.dataAry[index]) {
            this._getData(function (dataAry) {
                _this._dataArySave(dataAry);
                _this._render(index);
            });
            return;
        }

        if (this.numBtn) {
            this._renderPageControl(index);
        }

        this._renderContent(index);
    },

    // 默认页面按钮内容格式化
    _formatPageControl: function (pageNum) {
        return pageNum + 1;
    },

    _createPageControl: function () {
        var controlWrapper = this.controlEl,
            ul = document.createElement('ul');

        ul.className = this.className.ulClassName;

        controlWrapper.append(ul);
    },

    //分页按钮数组
    _pageArySave: function () {
        var _this = this,
            element,
            i = 0,
            len = this.pageLen;

        for (; i < len; i++) {
            element = document.createElement('li');
            element.innerHTML = _this._formatPageControl(i);
            this.pageAry.push(element);
            (function (i) {
                element.addEventListener('click', function () {
                    _this._render(i);
                })
            })(i);
        }
    },

    // 分页按钮渲染 + 分页按钮状态
    _renderPageControl: function (index) {
        var actClassName = this.className.actClassName,
            controlWrapper = this.controlEl,
            controlBtn = controlWrapper.find('ul'),
            fragment = document.createDocumentFragment(),
            len = this.renderPageLen,
            halfLen = Math.ceil(this.renderPageLen / 2),
            totalLen = this.pageAry.length,
            i = 0,
            showI,
            bIndex;
        // bIndex render的start position; showI 激活位置

        if (index <= halfLen - 1) {
            showI = index;
            bIndex = 0;
        } else if (index >= totalLen - halfLen) {
            showI = index % len;
            bIndex = totalLen - len;
        } else {
            bIndex = index - halfLen + 1;
            showI = halfLen - 1;
        }

        for (; i < len; i++) {
            fragment.appendChild(this.pageAry[bIndex + i]);
        }

        controlBtn.html(fragment);

        controlBtn.find('li').eq(showI).addClass(actClassName).siblings().removeClass(actClassName);

    },

    // 上一页按钮
    _createPrev: function () {
        var _this = this,
            controlEl = this.controlEl,
            prev = document.createElement('span');

        prev.className = this.className.prevClassName;
        prev.innerHTML = '上一页';

        prev.addEventListener('click', function () {
            _this.curIndex = _this.curIndex-- > 0 ? _this.curIndex : 0;
            _this._render(_this.curIndex);
        });

        controlEl.append(prev);
    },

    // 下一页按钮
    _createNext: function () {
        var _this = this,
            controlEl = this.controlEl,
            next = document.createElement('span'),
            len = this.pageLen - 1;

        next.className = this.className.nextClassName;
        next.innerHTML = '下一页';
        next.addEventListener('click', function () {
            _this.curIndex = _this.curIndex++ >= len ? len : _this.curIndex;
            _this._render(_this.curIndex);
        });

        controlEl.append(next);
    },

    // 默认渲染内容格式化
    _formatContent: function (conData) {
        var str = '';
        for (var i in conData) {
            str += conData[i] + '<br/>';
        }
        return str;
    },
    // 渲染内容
    _renderContent: function (index) {
        var _this = this,
            conEl = this.conEl,
            data = this.dataAry[index],
            str = '';

        data.forEach(function (item) {
            str += _this._formatContent(item);
        });

        conEl.html(str);
    }
}

var pagenation1 = new Pagenation({
    conEl: $(".page-content"),
    controlEl: $('.control-wrapper'),
    className: {
        actClassName: 'active',
        nextClassName: 'next',
        prevClassName: 'prev',
        ulClassName: 'page-list'
    },
    size: 1,
    interfacePaging: false,
    _getData: function (callback) {
        $.ajax({
            type: "GET",
            // url: '//gamebox.2144.cn/v1/server/list/gid/' + 92,
            url: './data/data' + (1 && (this.curIndex + 1)) + '.json',
            // dataType: "jsonp",
            success: function (data) {
                callback && callback(data.list, data.total_page);
            }
        })
    }
    // _formatPageControl: function (pageNum) {
    //     return pageNum + 1;
    // },
    // _formatContent: function (data) {
    //     return data.game_name + '<br/>';
    // }
})