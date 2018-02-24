var Pagination = function (options) {
    this.options = this.getOptions(options);
    this.init(this.options);
}

Pagination.prototype = {
    constructor: Pagination,

    getDefaults: function () {
        const DEFAULTOPTIONS = {
            defaultSize: 10,//默认分页大小
            pageIndexName: 'page',//分页参数名称
            pageSizeName: 'page_size',//分页大小参数名称
            onChange: $.noop,//分页改变或分页大小改变时的回调
            onInit: $.noop,//初始化完毕的回调
            allowActiveClick: true,//控制当前页是否允许重复点击刷新
            middlePageItems: 4,//中间连续部分显示的分页项
            frontPageItems: 3,//分页起始部分最多显示3个分页项，否则就会出现省略分页项
            backPageItems: 2,//分页结束部分最多显示2个分页项，否则就会出现省略分页项
            ellipseText: '...',//中间省略部分的文本
            prevDisplay: true,//是否显示上一页按钮
            nextDisplay: true,//是否显示下一页按钮
            firstDisplay: true,//是否显示首页按钮
            lastDisplay: true,//是否显示尾页按钮
        };

        return DEFAULTOPTIONS;
    },

    getOptions: function (options) {
        var DEFAULTS = this.getDefaults(),
            _opts = $.extend(true, DEFAULTS, options),
            opts = {};

        // 保证返回的对象内容项始终与当前类定义的DEFAULTS的内容项保持一致
        for (var i in DEFAULTS) {
            if (Object.prototype.hasOwnProperty.call(DEFAULTS, i)) {
                opts[i] = _opts[i];
            }
        }

        return opts;
    },

    init: function () {
        var element = this.options.element,
            dataNum = this.options.dataNum;

        this.getFullList(element, function () {
            self.renderPage(element);
        });
    },

    pageIndexChange: function () {
        if (this.disabled) return;

        this.pageIndex = pageIndex;
        this.trigger('pageViewChange');
    },

    //  启用
    enable: function () {
        this.disabled = false;
        this.element.removeClass('disabled');
    },
    // 禁用
    disabled: function () {
        this.disabled = true;
        this.element.addClass('disabled');
    },

    bindEvents: function () {
        var self = this,
            opts = this.getOptions(),
            element = opts.element;
        //首页
        opts.firstDisplay && element.on('click', '.first:not(.disabled)', function () {
            pageIndexChange(1);
        });

        //末页
        opts.lastDisplay && element.on('click', '.last:not(.disabled)', function () {
            pageIndexChange(self.data.pages);
        });

        //上一页
        opts.prevDisplay && element.on('click', '.prev:not(.disabled)', function () {
            pageIndexChange(self.pageIndex - 1);
        });

        //下一页
        opts.nextDisplay && element.on('click', '.next:not(.disabled)', function () {
            pageIndexChange(self.pageIndex + 1);
        });

        //具体页
        element.on('click', '.page', function (e) {

            var $this = $(this),
                callback = true;

            if ($this.parent().hasClass('active') && !opts.allowActiveClick) {
                callback = false;
            }

            callback && pageIndexChange(parseInt($.trim($this.text())), $this);
        });
    },

    getFullList: function (element, callback) {
        var self = this,
            groups = this.splitPage();

        this.renderPage(element, groups, function () {
            // self.bindEvents();
        })
    },

    splitPage: function () {
        var options = this.options,
            pages = Math.ceil(options.dataSize / options.defaultSize);

        return pages;
    },
    
    renderItem: function(page){

    },

    renderPage: function (element, groups, callback) {
        var opts = this.options,
            html = [];

        //首页
        opts.firstDisplay && html.push([`<li class="first">首页</li>`]);

        //上一页
        opts.prevDisplay && html.push([`<li class="prev">上一页</li>`]);

        function appendItem(page) {
            page = page + 1;

            html.push([
                '<li class="page ',
                page == data.pageIndex ? 'active' : '',
                '"><a href="javascript:;">',
                page,
                '</a></li>',
            ].join(''));
        }

        function appendEllItem() {
            html.push([
                '<li class="page page_ell',
                '"><span>',
                opts.ellipseText,
                '</span></li>',
            ].join(''));
        }

        var interval = getInterval(data, opts);

        产生起始点
        if (interval[0] > 0 && opts.frontPageItems > 0) {
            var end = Math.min(opts.frontPageItems, interval[0]);
            for (var i = 0; i < end; i++) {
                appendItem(i);
            }
            if (opts.frontPageItems < interval[0] && opts.ellipseText) {
                appendEllItem();
            }
        }

        //下一页
        opts.nextDisplay && html.push([`<li class="next">下一页</li>`]);

        //尾页
        opts.lastDisplay && html.push([`<li class="last">尾页</li>`]);

        element.html(html.join(''));

        callback && callback();
    },

    render: function () {
        console.log('渲染内容');
    }
}

new Pagination({
    element: $('.page-list'),
    dataSize: 100,
    render: function () {
        console.log('use new render');
    }
})