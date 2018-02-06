// 1234567890 --> 1,234,567,890



function formatMoney(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}