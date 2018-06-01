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
    this.showPageCount = 4;//显示页码按钮数
    this.curIndex = 0;//当前页

    // 分页按钮显示方式
    this.mode = 'all';

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
        this._pageArySave();
        this._createElement();
        this._render(0);
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

    //分页按钮数组
    _pageArySave: function () {
        var _this = this,
            element,
            i = 0,
            len = this.pageCount,
            activeCls = this.activeCls;

        for (; i < len; i++) {
            element = document.createElement('li');
            a = document.createElement('a');
            element.appendChild(a);
            a.innerHTML = _this._formatPageControl(i);
            this.pageAry.push(element);
            (function (i) {
                a.addEventListener('click', function () {
                    if (this.className.indexOf(activeCls) > -1) {
                        return;
                    }
                    _this._render(i);
                })
            })(i);
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

        if (this.showPN) {
            this._renderPageControl(index);
        }

        this._renderContent(index);

    },

    // 默认页面按钮内容格式化
    _formatPageControl: function (pageNum) {
        return pageNum + 1;
    },

    // 分页按钮渲染 + 分页按钮状态
    _renderPageControl: function (index) {
        var actClassName = this.activeCls,
            pageBox = this.pageBox,
            btnBox = pageBox.find('ul'),
            fragment = document.createDocumentFragment(),
            len = this.showPageCount,
            totalLen = this.pageAry.length,
            i = 0,
            showI = index,
            bIndex = 0;

        switch (this.mode) {
            case 'all':
                len = totalLen;
                bIndex = 0; 
                for (; i < len; i++) {
                    fragment.appendChild(this.pageAry[bIndex + i]);
                }
                break;
            case 'fixed':
                var halfLen = Math.ceil(len / 2);
                // bIndex render的start position; showI 激活位置
                if (totalLen <= len) {
                    bIndex = 0;
                    len = totalLen;
                } else {
                    if (index <= halfLen - 1) {
                        showI = index;
                        bIndex = 0;
                    } else if (index >= totalLen - halfLen - 1) {
                        showI = len - (totalLen - index);
                        bIndex = totalLen - len;
                    } else {
                        bIndex = index - halfLen + 1;
                        showI = halfLen - 1;
                    }
                } 
                for (; i < len; i++) {
                    fragment.appendChild(this.pageAry[bIndex + i]);
                }
                
                break;
            case 'unfixed':
                break;
            default:
                break;
        }

        btnBox.html(fragment);

        this._btnStatus(showI);

    },

    // 按钮状态
    _btnStatus: function (index) {
        var actClassName = this.activeCls,
            pageBox = this.pageBox,
            btnBox = pageBox.find('ul'),
            as = btnBox.find('a'),
            i = 0,
            len = as.length;

        for (; i < len; i++) {
            as.eq(i).removeClass(actClassName)
        }


        as.eq(index).addClass(actClassName);
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

new Pagenation({
    conBox: $(".page-content"),
    pageBox: $('.control-wrapper'),
    ulCls: 'page-list',
    showDataCount: 1,
    mode: 'fixed',
    _getData: function (callback) {
        $.ajax({
            type: "GET",
            url: './data/data' + (1 && (this.curIndex + 1)) + '.json',
            // url: '//gamebox.2144.cn/v1/server/list/gid/' + 92,
            // dataType: "jsonp",
            success: function (data) {
                // console.time('render');
                // callback && callback(data.list);
                callback && callback(data.list,data.total_page);
                // callback && callback(data.data.items);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest, textStatus, errorThrown)
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