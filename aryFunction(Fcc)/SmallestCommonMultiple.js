// 找出能被两个给定参数和它们之间的《  连续数字 》整除的最小公倍数。
//  smallestCommons([1,5]);  => 60

function smallestCommons(arr) {
    arr = arr.sort(function (a, b) {
        return a - b;
    });

    var sum = arr[0];

    // 找到两个数的公约数
    function gcd(m, n) {
        if (m % n == 0) return n;
        return gcd(n, m % n);
    }

    for (var i = arr[0] + 1; i <= arr[1]; i++) {
        sum *= i / gcd(sum, i);
    }

    return sum;
}

