console.log(123123);
window.onerror = function(message, url, line, column, error) {
    console.log('log---onerror::::', message, url, line, column, error);
}
