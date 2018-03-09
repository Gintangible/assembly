//摧毁函数 第一个参数是待摧毁的数组，其余的参数是待摧毁的值。

function destroyer(arr) {
    // 请把你的代码写在这里
    var arg = arguments;
    var length = arg.length;
    return arr.filter(function(item){
        var a = true;
        for(var i = 1; i < length; i++){
            if( item === arg[i]){
                a =  false;
            }
        }
        return a;
    });
}

destroyer([1, 2, 3, 1, 2, 3], 2, 3);
