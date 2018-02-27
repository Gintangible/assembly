var Pagination = function (options) {
    this.options = this.getOptions(options);
    this.init(this.options);
}

Pagination.prototype = {
    constructor: Pagination,

    getDefaults: function () {
        const DEFAULTOPTIONS = {
            defaultIndex: 1,///默认页
            defaultSize: 10,//默认分页大小
            onChange: $.noop,//分页改变或分页大小改变时的回调
            onInit: $.noop,//初始化完毕的回调
            allowActiveClick: true,//控制当前页是否允许重复点击刷新
            middlePageItems: 4,//中间连续部分显示的分页项
            frontPageItems: 3,//分页起始部分最多显示3个分页项，否则就会出现省略分页项
            backPageItems: 2,//分页结束部分最多显示2个分页项，否则就会出现省略分页项
            prevDisplay: true,//是否显示上一页按钮
            nextDisplay: true,//是否显示下一页按钮
            firstDisplay: true,//是否显示首页按钮
            lastDisplay: true,//是否显示尾页按钮
        };

        return DEFAULTOPTIONS;
    },

    getOptions: function (options) {
        var DEFAULTS = this.getDefaults(),
            opts = $.extend(true, DEFAULTS, options);
        return opts;
    },

    init: function () {
        var element = this.options.element,
            dataNum = this.options.dataNum;

        this.getFullList(element, function () {
            self.renderPage(element);
        });
    },

    pageIndexChange: function (pageIndex) {
        var item = this.options.element.find('.page');

        this.pageIndex = pageIndex;
        
        item.eq(pageIndex-1).addClass('active').siblings().removeClass('active');

        this.options.render(pageIndex)
       
    },

    //  启用
    // enable: function () {
    //     this.disabled = false;
    //     this.element.removeClass('disabled');
    // },
    // 禁用
    // disabled: function () {
    //     this.disabled = true;
    //     this.element.addClass('disabled');
    // },

    bindEvents: function () {
        var self = this,
            opts = this.options,
            element = opts.element,
            pages = this.splitPage();
        //首页
        opts.firstDisplay && element.on('click', '.first:not(.disabled)', function () {
            self.pageIndexChange(1);
        });

        //末页
        opts.lastDisplay && element.on('click', '.last:not(.disabled)', function () {
           self.pageIndexChange(pages);
        });

        //上一页
        opts.prevDisplay && element.on('click', '.prev:not(.disabled)', function () {
            self.pageIndexChange(self.pageIndex - 1);
        });

        //下一页
        opts.nextDisplay && element.on('click', '.next:not(.disabled)', function () {
            self.pageIndexChange(self.pageIndex + 1);
        });

        //具体页
        element.on('click', '.page', function (e) {

            var $this = $(this),
                callback = true;

            if ($this.parent().hasClass('active') && !opts.allowActiveClick) {
                callback = false;
            }

            callback && self.pageIndexChange($this.index()-1);
        });
    },

    getFullList: function (element, callback) {
        var self = this,
            groups = this.splitPage();

        this.renderPage(element, groups, function () {
            self.bindEvents();
        })
    },

    // 分页
    splitPage: function () {
        var options = this.options, 
            pages = Math.ceil(options.dataSize / options.defaultSize);

        return pages;
    },

    // 中间页
    renderItem: function (page) {
        var defaultIndex = this.options.defaultIndex,
            items = [];
        for (var i = 1; i <= page; i++) {
            items.push('<li class="page ' + (i == defaultIndex ? "active" : "") + '">' + i + '</li>');
        }
        return items;
    },

    //... 
    renderEllItem: function () {
        return '<li>...</li>'
    },

    //render page
    renderPage: function (element, groups, callback) {
        var opts = this.options,
            html = [];

        //首页
        opts.firstDisplay && html.push([`<li class="first">首页</li>`]);

        //上一页
        opts.prevDisplay && html.push([`<li class="prev">上一页</li>`]);

        // 中间页
        html.push(this.renderItem(groups).join(''));

        // var interval = getInterval(data, opts);

        // 产生起始点
        // if (interval[0] > 0 && opts.frontPageItems > 0) {
        //     var end = Math.min(opts.frontPageItems, interval[0]);
        //     for (var i = 0; i < end; i++) {
        //         appendItem(i);
        //     }
        //     if (opts.frontPageItems < interval[0] && opts.ellipseText) {
        //         appendEllItem();
        //     }
        // }

        //下一页
        opts.nextDisplay && html.push([`<li class="next">下一页</li>`]);

        //尾页
        opts.lastDisplay && html.push([`<li class="last">尾页</li>`]);

        element.html(html.join(''));

        callback && callback();
    },

    render: function (pageIndex) {
        console.log('渲染内容'+pageIndex);
    }
}

new Pagination({
    element: $('.page-list'),
    dataSize: 100,
    render: function () {
        console.log('use new render');
    }
})