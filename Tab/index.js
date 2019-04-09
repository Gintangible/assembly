// 切换
function Tab(obj) {
    var defaultOptions = {
        btns: null,
        cons: null,
        event: 'click',
        active: 'act',
        afterTabEvent: function () {}
    };

    Object.assign(defaultOptions, obj || {});

    for (let k in defaultOptions) {
        this[k] = defaultOptions[k];
    }

    this._init();
}

Tab.prototype = {
    construct: Tab,
    _init: function () {
        const _this = this;

        this.lenMatch();

        this.btns.forEach((item, index) => {
            item.addEventListener(_this.event, function () {
                _this._reset();
                _this._set(index);
                typeof _this.afterTabEvent === 'function' && _this.afterTabEvent(index, _this);
            })
        })
    },
    _reset: function () {
        const _this = this;

        this.btns.forEach((item, index) => {
            item.classList.remove(_this.active);
            _this.cons[index] && _this.cons[index].classList.remove(_this.active);
        })
    },
    _set: function (i) {
        this.btns[i].classList.add(this.active);
        this.cons[i] && this.cons[i].classList.add(this.active);
    },
    lenMatch: function () {
        console.assert(this.btns.length !== this.cons.length, '内容个数与按钮数不匹配');
        return;
    }
}


new Tab({
    btns: document.querySelectorAll('.tab li'),
    cons: document.querySelectorAll('.content li'),
})