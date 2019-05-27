window.onerror = function(message, url, line, column, error) {
    console.log('log---onerror::::', message, url, line, column, error);
}


function ping(options) {
    const nIMG = new Image();
    const DEFAULTOPTIONS = {
        url: location.origin,
        afterPing: function(ping) {
            console.log(ping);
        },
        interval: 1000
    }

    const obj = Object.assign(DEFAULTOPTIONS, options);
    const url = (/http:\/\//.test(obj.url)) ? obj.url : 'http' + obj.url;
    const startTime = +new Date();
    nIMG.onload = nIMG.onerror = function() {
        const endTime = +new Date();
        obj.afterPing(endTime - startTime);
    }
    nIMG.src = url + '/' + startTime;
}

