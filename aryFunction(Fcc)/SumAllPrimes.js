// 求小于等于给定数值的所有质数之和。


function sumPrimes(num) {
    var arr = [];
    function isPrime(num) {
        for (var i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) {
                return true;
            }
        }
        return false;
    }

    for(var i = 2; i <= num; i++){
        if(!isPrime(i)){
            arr.push(i);
        }
    }

    return arr.reduce(function(prev,next){
        return prev + next;
    });

}