// 切换
function Tab(obj){
    var defaultOptions = {
        btns: null,
        cons: null,
        event: 'click',
        active: 'act',
        callback: function(){}
    }
    Object.assign(defaultOptions, obj || {})
    for (let k in defaultOptions) {
        this[k] = defaultOptions[k];
    }
    this._init();
}

Tab.prototype = {
    construct: Tab,
    _init: function(){
        const _this = this;
        this.btns.forEach((item,index) =>{
            item.addEventListener('click', function () {
                _this._reset();
                _this._set(index);
                typeof _thiscallback === 'function' && _this.callback(index);
            })
        })
    },
    _reset: function(){
        const _this = this;
        this.btns.forEach((item,index) =>{
            item.classList.remove(_this.active);
            _this.cons[index].remove(_this.active);
        })
    },
    _set: function(i){
        this.btns[i].classList.add(this.active);
        this.cons[i].classList.add(this.active);
    }
}
