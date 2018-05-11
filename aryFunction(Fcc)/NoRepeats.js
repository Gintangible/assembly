function permAlone(string) {
 
  var consecutive = /(.)\1/;
 
  return heap(string).filter(function(item) {
    return !consecutive.test(item);
  }).length;  // We return the length of the filtered array.
 
  function heap(string) {
    var arr = string.split(''),
      permutations = [];
 
    function swap(a, b) {
      var tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;
    }
 
    function gen(n) {
      if (n === 1) {
        console.log('1   ' + arr)
        permutations.push(arr.join(''));
      } else {
        for (var i = 0; i != n; i++) {
            console.log("2         "+ n%2)
          gen(n - 1);
          swap(n % 2 ? 0 : i, n - 1);
        }
      }
    }
 
    gen(arr.length);
    console.log(permutations)
    return permutations;
  }
}

permAlone('aab');
