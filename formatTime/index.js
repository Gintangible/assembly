// 5 -> 05
var formatNum = function(num) {
    return (0..toFixed(2) + num).slice(-2);
};
// 2018-06-17 23:59:59 -> 2018年6月17日23:59

var formatTime = function(time) {
    var time = new Date(time.replace(/-/g, "/")),
        year = time.getFullYear() + '年',
        month = time.getMonth() + 1 + '月',
        day = time.getDate() + '日',
        hours = time.getHours(),
        min = time.getMinutes()

    return year + month + day + formatNum(hours) + ':' + formatNum(min);
};