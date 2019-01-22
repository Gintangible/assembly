// 1234567890 --> 1,234,567,890
function formatMoney(num) {
    let arr = num.toString().split('.');
    return (
        arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        (arr[1] ? '.' + arr[1] : '')
    );
}

// 12345 => 一万二千三百四十五
const toChineseNum = num => {
    let nums = num
        .toString()
        .split('')
        .reverse();
    let cnNum = '零一二三四五六七八九';
    let suffix = ['','十','百','千','万','十','百','千','亿','十','百','千','万'];

    return nums
        .map((item, index) => {
            return cnNum[item] + ((item != 0 || !(index % 4)) ? suffix[index] : '');
        })
        .reverse()
        .join('').replace(/(零(?=零))|(零$)|(零(?=万))/g, '');
};

