// 文字过长，通过展开显示

function contentOpen(el, options) {
    var element = typeof el === 'string' ? document.querySelector(el) : el;
    var text = element.innerHTML;
    var cH = element.clientHeight;
    var options = options || {};
    var showHeight = options.showHeight || 100;
    var openClassName = options.openClassName || '';

    if (cH > showHeight) {
        var newBox = document.createElement('div');
        newBox.innerHTML = text;
        newBox.className = options.contentClassName || "";
        newBox.style.height = showHeight + 'px';
        newBox.style.overflow = 'hidden';
        var span = document.createElement('div');
        span.className = openClassName;
        span.innerHTML = '展开';
        element.innerHTML = '';
        element.appendChild(newBox);
        element.appendChild(span);
        span.addEventListener('click', function () {
            if (!span.state) {
                this.innerHTML = '收起';
                newBox.style.height = 'auto';
            } else {
                this.innerHTML = '展开';
                newBox.style.height = showHeight + 'px';
            }
            span.state = !span.state;
        })
    }
}

contentOpen('.text');

// contentOpen('.text', {
//     showHeight: 60
// });