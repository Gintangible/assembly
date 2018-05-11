// 创建一个函数，接受两个或多个数组，返回所给数组的 对等差分(symmetric difference) (△ or ⊕)数组.

// 给出两个集合 (如集合 A = {1, 2, 3} 和集合 B = {2, 3, 4}), 而数学术语 "对等差分" 的集合就是指由所有只在两个集合其中之一的元素组成的集合(A △ B = C = {1, 4}). 对于传入的额外集合 (如 D = {2, 3}), 你应该安装前面原则求前两个集合的结果与新集合的对等差分集合 (C △ D = {1, 4} △ {2, 3} = {1, 2, 3, 4}).

function sym(args){
    var newArr = Array.prototype.slice.call(arguments);

    return newArr.reduce(
        (arr1,arr2) => {
            return arr1.concat(arr2).filter(
                (item) => {
                    return arr1.indexOf(item) === -1 || arr2.indexOf(item) === -1;
                }
            ).filter(
                (item,index,arr) =>{
                    return arr.indexOf(item) === index;   
                }
            )
        }
    );
}