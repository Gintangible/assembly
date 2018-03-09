// 给一个正整数num，返回小于或等于num的斐波纳契奇数之和。
// 斐波纳契数列中的前几个数字是 1、1、2、3、5 和 8，随后的每一个数字都是前两个数字之和。

function sumFibs(num) {
    var cache = [1, 1];

    if (num >= cache.length) {
        for (var i = cache.length; i < num; i++) {
            cache[i] = cache[i - 2] + cache[i - 1];
        }
    }


    var arr = cache.filter(function (item) {
        return item % 2 !== 0 && item <= num;
    });

    return arr.reduce(function (prev, next) {
        return prev + next;
    });
}