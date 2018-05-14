/**
	 * 服务器列表弹出层
	 */
var ServerList = function () {
    /**
     * 获取完整的服务器列表
     */
    var getFullList = function (id, callback) {
        $.getJSON('//gamebox.2144.cn/v1/server/list/gid/' + id + '?callback=?', function (data) {
            if (typeof callback === 'function' && data && data.data && $.isArray(data.data.items) && data.data.items.length) {
                console.time("renderAll");
                callback(data.data.items);
            }
        });
    };
    /**
     * 将获取到的服务器列表进行分页
     */
    var splitPage = function (data) {
        var origin = data.slice(),
            groups = [],
            pageOfItemNumber = 30,
            group;
        while (data.length > pageOfItemNumber) {
            group = data.splice(data.length - pageOfItemNumber, pageOfItemNumber);
            groups.unshift({
                items: group,
                end: group[0].sid,
                begin: group[group.length - 1].sid
            });
        }
        if (data.length) {
            group = origin.slice(0, pageOfItemNumber);
            groups.unshift({
                items: group,
                end: group[0].sid,
                begin: group[group.length - 1].sid
            });
        }
        return groups;
    };

    var renderList = function (element, groups) {
        // 注：使用join连接字符串可以使速度加快一倍以上
        var html = groups.reduce(function (prev, group, index) {
            return [prev,
                '<ul', (index ? ' class="hidden"' : ''), '>',
                group.items.reduce(function (prev, item) {
                    return [prev,
                        '<li><a href="', item.api.replace(/"/g, '&quot;'), '">', item.s_name, '</a></li>'
                    ].join('');
                }, ''),
                '</ul>'
            ].join('');
        }, '');
        // 添加到页面中
        element.find('.sl_bd').html(html);
    };
    var renderPage = function (element, groups) {
        if (groups.length <= 1) return;
        // 注：使用join连接字符串可以使速度加快一倍以上
        var html = [
            '<div class="sl_ft">',
            '	<div class="sl_view">',
            '		<div class="sl_sport">',
            function () {
                var pageOfItemNumber = 4,
                    pages = [],
                    i;
                for (i = 0; i < groups.length; i += pageOfItemNumber) {
                    pages.push(groups.slice(i, i + pageOfItemNumber));
                }
                return pages.reduce(function (prev, group, i) {
                    return [prev,
                        '<ul>',
                        group.reduce(function (prev, item, j) {
                            var index = i * pageOfItemNumber + j,
                                text = [item.begin, '-', item.end].join('');
                            return [prev, '<li><span data-index="', index, '">', text, '</span></li>'].join('');
                        }, ''),
                        '</ul>'
                    ].join('');
                }, '');
            } (),
            '		</div>',
            '	</div>',
            '</div>'
        ].join('');
        // 添加到页面中
        element.find('.sl_bd').after(html);
        // 绑定事件
        element.on('click', 'span[data-index]', function () {		// 翻页
            var button = $(this),
                index = button.attr('data-index');
            element.find('.sl_bd ul').addClass('hidden').eq(index).removeClass('hidden');
        });
    };
    var create = function (id, callback) {
        destroy();
        var element = $([
            '<div class="server_list">',
            '	<div class="sl_line"></div>',
            '	<div class="sl_cont">',
            '		<div class="sl_hd">',
            '			<h2>选择服务器</h2>',
            '			<span class="sl_close"></span>',
            '		</div>',
            '		<div class="sl_bd">',
            '			<div class="sl_loading"><i></i>加载中，请稍后...</div>',
            '		</div>',
            '	</div>',
            '</div>'
        ].join(''))
            .appendTo(document.body)						// 添加到页面中
            .on('click', '.sl_close', function () {			// 点击关闭
                destroy();
            });
        // 渲染服务器列表
        getFullList(id, function (data) {
            var groups = splitPage(data);
            // 创建列表
            renderList(element, groups);
            // 创建分页
            renderPage(element, groups);

            console.timeEnd("renderAll");
        });
    };
    var destroy = function () {
        $('.server_list').remove();
    };
    var show = function () {
        create.apply(this, arguments);
    };
    var hide = function () {
        destroy.apply(this, arguments);
    };
    return {
        show: show,
        hide: hide
    };
} ();

ServerList.show(92);