// 对嵌套的数组进行扁平化处理。你必须考虑到不同层级的嵌套。
// steamroller([1, [2], [3, [[4]]]]); => [1,2,3,4]

function steamroller(arr) {
    var newArr = [],
        i = 0, len = arr.length;

    for (; i < len; i++) {
        if(!Array.isArray(arr[i])){
            newArr.push(arr[i]);
        }else{
            newArr = newArr.concat(steamroller(arr[i]));
        }
    }

    return newArr;
}

