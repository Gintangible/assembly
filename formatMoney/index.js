// 1234567890 --> 1,234,567,890



function formatMoney(num) {
    let arr = num.toString().split('.');
    return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (arr[1] ? "." + arr[1] : "");
}