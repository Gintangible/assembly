// 传入二进制字符串，翻译成英语句子并返回。

function binaryAgent(str) {
    var result = [],
        arr = str.split(' '),
        i, len;

    for (i = 0, len = arr.length; i < len; i++) {
        var num = parseInt(arr[i], 2);
        result.push(String.fromCharCode(num));
    }


    return result.join('');
}