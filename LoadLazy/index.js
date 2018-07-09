// loadLazy
/*
 * 调用:
 *    lazyload(ele,{
 *        original : 'data-original',
 *    });
 */
lazyload = function(ele, config) {
    var doc = document,
        doc_body = doc.body || doc.documentElement,
        ele = ele || doc, //lazy加载父级容器
        config = config || {
            original: 'data-src',
            distance: 200,
            effect: null
        },
        imgAry = [], //lazy元素数组
        lazyNum = 0, //已加载的数量
        original = config.original,
        distance = config.distance, //lazy加载距离
        effect = config.effect;

    function initElementMap() { //遍历获取图片集合
        var imgs = ele.querySelectorAll('img[' + original + ']'),
            i, len = imgs.length;
        //获取lazy图数组
        for (i = 0; i < len; i++) {
            imgAry.push({
                ele: imgs[i],
                top: getEleTop(imgs[i]),
                isLoad: false
            });
            lazyNum++;
        }
    }

    function loader() {
        if (!lazyNum) return;

        var getScrollTop = doc_body.scrollTop,
            height = doc_body.clientHeight, //显示窗口页面高度
            downScrollTop = getScrollTop + height, //页面底部到页面顶部的距离
            imgShowHeight = distance + downScrollTop, //图片显示的高度
            i = 0,
            len = imgAry.length;

        for (; i < len; i++) {
            var img = imgAry[i],
                ele = img.ele;
            if (imgShowHeight > img.top && !img.isLoad) { //已加载图片，中断scroll事件
                var img = imgAry[i];
                ele = img.ele;
                if (imgShowHeight > img.top || ele.getAttribute(original)) { //已加载图片，中断scroll事件
                    ele.src = ele.getAttribute(original);
                    ele.removeAttribute(original);
                    img.isLoad = true;
                    effect && ele.effect; //是否用动画

                    lazyNum--;
                }
            }

        }
    }

    function getEleTop(element) { //获取元素到页面顶部距离
        if (arguments.length != 1 || element == null) {
            return null;
        }
        var offsetTop = element.offsetTop,
            parent = element.offsetParent;
        while (parent !== null) {
            offsetTop += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return offsetTop;
    }


    function init() {
        initElementMap();
        loader();
    }

    init();
    window.addEventListener('scroll', loader);
};

lazyload();