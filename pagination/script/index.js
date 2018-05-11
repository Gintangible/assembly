var Pagenation = function (options) {
    // 默认值
    /*
    * parma dataArg        	    array       保存列表数据
    * parma actClassName        string      按钮激活类名
    * parma size                number      默认每页数量
    * parma arrowBtn            booble      是否创建上一页下一页
    * parma numBtn              booble      数字分页
    * parma curIndex            number      当前页
    */
    this.dataAry = [];
    this.actClassName = 'active';
    this.size = 10;
    this.arrowBtn = true;
    this.numBtn = true;
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
        throw new Error('need set a _getData function');
    },
    // 执行
    _init: function () {
        var _this = this;
        this._getData(function (data) {
            _this._showInit(data);
        })
    },
    // 显示初始化
    _showInit: function (data) {
        var _this = this;

        this._dataArySave(data, function () {
            _this._renderContent(_this.curIndex);
            if (_this.arrowBtn) {
                _this._createPrev();
            }
            if (_this.numBtn) {
                _this._renderPageControl(data.length);
            }
        });
    },
    // 上一页按钮
    _createPrev: function () {
        var _this = this,
            controlEl = this.controlEl,
            prev = document.createElement('span');
        prev.className = 'prev';
        prev.innerHTML = '上一页';

        prev.addEventListener('click', function () {
            _this.curIndex = _this.curIndex-- > 0 ? _this.curIndex : 0;
            _this._conChange(_this.curIndex);
        });

        controlEl.append(prev);
    },
    // 保存分页数据
    _dataArySave: function (data, callback) {
        var totalSize = Math.ceil(data.length / this.size),
            size = this.size,
            i = 0;

        for (; i < totalSize; i++) {
            this.dataAry.push(data.slice(size * i, size * (i + 1)));
        }

        callback && callback();
    },
    _conChange: function (index) {
        this._pageBtnStatus(index)
        this._renderContent(index);
        this.curIndex = index;
    },
    // 分页按钮状态
    _pageBtnStatus: function (index) {
        var actClassName = this.actClassName,
            controlWrapper = this.controlEl,
            controlBtn = controlWrapper.find('ul');

        controlBtn.find('li').eq(index).addClass(actClassName).siblings().removeClass(actClassName);
    },
    // 默认页面按钮内容格式化
    _formatPageControl: function (pageNum) {
        return pageNum + 1;
    },
    // 分页按钮渲染
    _renderPageControl: function (len) {
        var _this = this,
            actClassName = this.actClassName,
            controlWrapper = this.controlEl,
            controlBtn = controlWrapper.find('ul'),
            fragment = document.createDocumentFragment(),
            element,
            i = 0;

        for (; i < len; i++) {
            element = document.createElement('li');
            element.innerHTML = _this._formatPageControl(i);
            fragment.appendChild(element);
            $(element).addClass(i == 0 ? actClassName : "");
            (function (i) {
                element.addEventListener('click', function () {
                    _this._conChange(i);
                })
            })(i);
        }

        controlBtn.html(fragment);
    },

    // 默认渲染内容格式化
    _formatContent: function (conData) {
        return conData;
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
    size: 1,
    _getData: function (callback) {
        $.ajax({
            type: "GET",
            url: './data/data1.json',
            // dataType: "jsonp",
            success: function (data) {
                callback && callback(data.list);
            }
        })
    },
    _formatPageControl: function (pageNum) {
        return pageNum + 1;
    },
    _formatContent: function (data) {
        return data.con + '<br/>';
    }
})
