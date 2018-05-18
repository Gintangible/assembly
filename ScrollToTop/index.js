function goTop(speed, time) {
    // 默认参数传递
    // 速率（默认1）
    speed = speed || 10;

    // 时间（默认16ms）
    time = time || 16;

    // 定义变量
    var x1,
        y1,
        x2,
        y2,
        x3,
        y3;

    //获取浏览器滚动的高，有一定的兼容效果
    if (document.documentElement) {
        x1 = document.documentElement.scrollLeft || 0;
        y1 = document.documentElement.scrollTop || 0;
    }
    if (document.body) {
        x2 = document.body.scrollLeft || 0;
        y2 = document.body.scrollTop || 0;
    }
    x3 = window.scrollX || 0;
    y3 = window.scrollY || 0;
    // 滚动条到页面顶部的水平距离
    var x = Math.max(x1, Math.max(x2, x3));
    // 滚动条到页面顶部的垂直距离
    var y = Math.max(y1, Math.max(y2, y3));
    // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
    var speed = 10 + speed;
    window.scrollTo(Math.floor(x - speed), Math.floor(y - speed));

    // 如果距离不为零, 继续调用迭代本函数
    if (x > 0 || y > 0) {
        window.setTimeout(function () {
            goTop(speed, time);
        }, time);
    }
}
