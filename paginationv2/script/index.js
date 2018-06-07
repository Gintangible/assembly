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
    * parma curIndex            number      当前页
    */
    this.conBox = null;//内容容器
    this.pageBox = null;//按钮容器
    this.dataAry = [];//数据数组
    this.pageAry = [];//页码数组

    // 是否显示分页按钮
    this.showPN = true;
    this.ulCls = 'page-btn';
    this.activeCls = 'active';

    // 上一页下一页
    this.showArrow = true;//是否一直显示上一页下一页
    this.prevCls = 'prev';//上一页class
    this.nextCls = 'next';//下一页class
    this.prevContent = '<';//上一页节点内容
    this.nextContent = '>';//下一页节点内容

    // 跳转
    this.jump = true;
    this.jumpCls = 'jump';//文本框内容
    this.jumpBtnContent = 'Go';//跳转按钮文本内容


    // 页码相关
    this.showDataCount = 10;//每页内容数
    this.pageCount = 10;//页数
    this.showPageCount = 5;//显示页码按钮数
    this.curIndex = 0;//当前页

    // 分页按钮显示方式
    this.mode = 'default';

    // 是否是接口分页请求
    this.interface = false;

    // 执行
    this._init(options);
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
        // arg1 为传递的数组 arg2为分页数（不是必须，for分页请求）
        throw new Error('must set a _getData function');
    },

    // 执行
    _init: function (options) {
        var _this = this;
        // 获取配置信息
        this._analysisOptions(options);

        this._getData(function (dataAry, setLen) {
            _this._dataInit(dataAry, setLen);
        })
    },

    // save ary and create
    _dataInit: function (dataAry, setLen) {
        this._getLen(dataAry.length, setLen);

        this._dataArySave(dataAry);
        this._createElement();
        this._render(0);

        this._bindEvent();
    },

    // 获取分页数
    _getLen: function (dataLen, setLen) {
        if (setLen) {
            this.interface = true;
        }

        this.pageCount = setLen || Math.ceil(dataLen / this.showDataCount);
    },

    // 保存分页数据
    _dataArySave: function (dataAry) {
        if (!this.interface) {
            var pageCount = this.pageCount,
                showDataCount = this.showDataCount,
                i = 0;
            for (; i < pageCount; i++) {
                this.dataAry.push(dataAry.slice(showDataCount * i, showDataCount * (i + 1)));
            }
        } else {
            this.dataAry[this.curIndex] = dataAry;
        }
    },

    // 创建
    _createElement: function () {
        if (this.showPN) {
            this._createPageControl();
        }
        if (this.showArrow) {
            this._createPrev();
            this._createNext();
        }
        if (this.jump) {
            this._createJump()
        }
    },

    // 按钮
    _createPageControl: function () {
        var pageBox = this.pageBox,
            ul = document.createElement('ul');

        ul.className = this.ulCls;

        pageBox.append(ul);

        if (this.showPageCount > this.pageCount) {
            this.mode = 'default';
        }

        if (this.mode == 'default') {
            this._pageDefault();
        }
    },

    // 上一页按钮
    _createPrev: function () {
        var _this = this,
            pageBox = this.pageBox,
            prev = document.createElement('a');

        prev.className = this.prevCls;
        prev.innerHTML = this.prevContent;

        prev.addEventListener('click', function () {
            _this.curIndex = _this.curIndex-- > 0 ? _this.curIndex : 0;
            _this._render(_this.curIndex);
        });

        pageBox.append(prev);
    },

    // 下一页按钮
    _createNext: function () {
        var _this = this,
            pageBox = this.pageBox,
            next = document.createElement('a'),
            len = this.pageCount - 1;

        next.className = this.nextCls;
        next.innerHTML = this.nextContent;

        next.addEventListener('click', function () {
            _this.curIndex = _this.curIndex++ >= len ? len : _this.curIndex;
            _this._render(_this.curIndex);
        });

        pageBox.append(next);
    },

    // 跳转按钮
    _createJump: function () {
        var _this = this,
            pageBox = this.pageBox,
            element = document.createElement('div'),
            input = document.createElement('input'),
            btn = document.createElement('a');

        element.className = this.jumpCls;
        btn.innerHTML = this.jumpBtnContent;

        input.addEventListener('input', function (e) {
            var val = this.value,
                reg = /[^\d]/g;

            if (reg.test(val)) {
                this.value = val.replace(reg, '');
            }

            if (val > _this.pageCount) {
                this.value = _this.pageCount;
            }

            if (parseInt(val) === 0) {
                this.value = 1;
            }
        })

        btn.addEventListener('click', function () {
            var index = input.value;

            if (!index) return;

            _this._render(index - 1);
        })

        document.addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                var index = input.value;
                if (!index) return;
                _this._render(index - 1);
            }
        })

        pageBox.append(element);
        element.append(input);
        element.append(btn);
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

        this._renderPageControl(index);

        this._renderContent(index);

        typeof this._personEvents === 'function' && this._personEvents(this.curIndex, this.pageCount, this.dataAry);

    },

    // 默认页面按钮内容格式化
    _formatPageControl: function (pageNum) {
        return pageNum + 1;
    },

    // page显示mode
    _pageDefault: function () {
        var pageBox = this.pageBox,
            btnBox = pageBox.find('ul'),
            pageCount = this.pageCount,
            str = '';

        for (var i = 0; i < pageCount; i++) {
            str += '<li data-page=' + i + '>' + this._formatPageControl(i) + '</li>';
        }

        btnBox.html(str);
    },

    // 分页按钮渲染 + 分页按钮状态
    _renderPageControl: function (index) {

        if (!this.showPN) return;
        var pageBox = this.pageBox,
            btnBox = pageBox.find('ul'),
            pageCount = this.pageCount

        switch (this.mode) {
            case 'fixed':
                var showLen = this.showPageCount,
                    halfLen = Math.ceil(showLen / 2),
                    i = 0,
                    str = '',
                    startI = 0;

                // startI render的start position;

                if (index <= halfLen - 1) {
                    startI = 0;
                } else if (index >= pageCount - halfLen - 1) {
                    startI = pageCount - showLen;
                    index = showLen - (pageCount - index);
                } else {
                    startI = index - halfLen + 1;
                    index = halfLen - 1;
                }

                for (; i < showLen; i++) {
                    str += '<li data-page=' + (startI + i) + '>' + this._formatPageControl((startI + i)) + '</li>';
                }

                btnBox.html(str);

                this._bindEvent();

                break;
            case 'unfixed': //...
                var showLen = this.showPageCount,//显示长度
                    halfLen = Math.floor(showLen / 2),
                    centerLen = this.centerLen || 3,
                    startLen = parseInt((showLen - centerLen) / 2),
                    str = '',
                    centerStr = '<li>...</li>',
                    i = 0;

                if (index < showLen - 2) {//头部
                    var str = '';
                    for (var i = 0; i < showLen - 1; i++) {
                        str += '<li data-page=' + i + '>' + this._formatPageControl(i) + '</li>';
                    }
                    str += centerStr + '<li data-page=' + (showLen - 1) + '>' + this._formatPageControl(showLen - 1) + '</li>';
                } else if (index >= pageCount - showLen) {// 尾部
                    var str = '';
                    str += '<li data-page=' + 0 + '>' + this._formatPageControl(0) + '</li>' + centerStr;
                    for (var i = 0; i < showLen - 1; i++) {
                        var num = pageCount - showLen + i;
                        str += '<li data-page=' + num + '>' + this._formatPageControl(num) + '</li>';
                    }
                } else {// 中间
                    if (index > halfLen) {
                        for (var i = 0; i < halfLen - 1; i++) {
                            str += '<li data-page=' + i + '>' + this._formatPageControl(i) + '</li>';
                        }
                    }

                    for (var i = 0; i < centerLen; i++) {
                        var num = +index + i - centerLen / 2
                        str += '<li data-page=' + num + '>' + this._formatPageControl(num) + '</li>';
                    }
                }




                btnBox.html(str);

                this._bindEvent();

                break;
            case 'personDesign':
                this._personDesign(this.pageCount);
                break;
            default:
                break;
        }


        this._btnStatus(index);

    },

    // 按钮状态
    _btnStatus: function (index) {
        var activeCls = this.activeCls,
            pageBox = this.pageBox,
            as = pageBox.find('ul li'),
            i = 0,
            len = as.length;

        for (; i < len; i++) {
            as.eq(i).removeClass(activeCls);
        }

        as.eq(index).addClass(activeCls);
    },

    _bindEvent: function () {
        var _this = this,
            activeCls = this.activeCls,
            pageBox = this.pageBox,
            as = pageBox.find('ul li');
        as.on('click', function () {
            var index = this.getAttribute('data-page');
            if (this.className.indexOf(activeCls) > -1) return;
            index && _this._render(index);
        })
    },

    // 定制事件
    _personEvents: function (index, pageCount, data) {
        console.warn('定制事件（内容）：' + '当前页：' + index + '；总页页：' + pageCount + '；当前页内容：', data);
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
            conBox = this.conBox,
            data = this.dataAry[index],
            str = '';

        data.forEach(function (item) {
            str += _this._formatContent(item);
        });

        conBox.html(str);
    }
}
