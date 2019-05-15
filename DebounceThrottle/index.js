// 防抖 
function debounce(fn, time = 500) {
    let timeout = null;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, time);
    }
}


// 节流 一定时间只可执行一次
function throttle(fn, time = 500) {
    let isOk = true;
    return () => {
        if (!isOk) return;
        isOk = false;
        setTimeout(() => {
            fn.apply(this.arguments);
            isOk = true;
        }, time);
    }
}