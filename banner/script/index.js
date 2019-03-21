var Slider = function (el, options) {
    var noop = function () {};

    this.el = el;
    Object.assign(this, {
        active: 'act',
        isArrow: true,
        arrowClass: 's-arrow',
        prevClass: null,
        nextClass: null,
        isButton: true,
        buttonClass: 's-button',
        interval: 3000,
        isAuto: true,
        direction: 'right',
        curIndex: 0,
        events: {
            btnChange: noop
        }
    }, options || {})

    this.view = null;
    this.items = [];
    this.length = 0;
    //this.distance = 0;
    this.tID = -2;

    this._init();
};
Slider.prototype = {
    constructor: Slider,

    _init: function () {
        this._create();
    },

    toArray: function (nodelist) {
        return [].slice.call(nodelist);
    },
    _create: function () {
        var self = this,
            element = this.el,
            view = this.view = element.firstElementChild,
            items = this.items = this.toArray(view.children);

        // 获取每次移动的距离
        //this.distance = items.outerWidth(true);
        // 获取项目的数量
        this.length = items.length;
        // 创建箭头按钮
        this.createArrow();
        // 创建按钮
        this.createButton();
        // 自动滚动
        this.autoSlider();
    },

    createArrow: function () {
        if (!this.isArrow) return;

        const self = this;
        const element = this.el;
        const div = document.createElement('div');
        this.arrowClass && div.classList.add(this.arrowClass);
        div.innerHTML = `<i class="s-prev">&lt;</i><i class="s-next">&gt;</i>`;

        const prev = div.querySelector('.s-prev');
        const next = div.querySelector('.s-next');

        this.prevClass && prev.classList.add(this.prevClass);
        this.nextClass && next.classList.add(this.nextClass);

        element.append(div);

        prev.addEventListener('click', () => {
            self.prev();
        })

        next.addEventListener('click', () => {
            self.next();
        })
    },

    createButton: function () {
        if (!this.isButton) return;

        const self = this;
        const element = this.el;
        const len = this.length;
        let events = this.events;
        const ul = document.createElement('ul');
        ul.classList.add(this.buttonClass);

        let = str = '';

        for (i = 0; i < len; i++) {
            str += '<li class="' + (this.curIndex === i ? this.active : "") + '"></li>';
        }

        ul.innerHTML = str;
        element.append(ul);

        const buttons = ul.querySelectorAll('li');

        buttons.forEach((item, i) => {
            item.addEventListener('click', () => {
                self.move(i);
            })
        })

        var originalOnBeforeMove = events.btnChange;

        events.btnChange = function (index) {
            buttons.forEach(item => {
                item.classList.remove(self.active);
            })
            buttons[index].classList.add(self.active);
            return originalOnBeforeMove.apply(this, arguments);
        }
    },

    autoSlider: function () {
        if (!this.isAuto) return;

        var self = this,
            element = this.el,
            start = function () {
                stop();
                self.tID = setInterval(function () {
                    self.next();
                }, self.interval);
            },
            stop = function () {
                if (self.tID !== -1) {
                    clearInterval(self.tID);
                    self.tID = -1;
                }
            };

        start();
        element.addEventListener('mouseenter', () => {
            stop();
        })
        element.addEventListener('mouseleave', () => {
            start();
        })
    },

    move: function (index) {
        var self = this,
            length = this.length,
            events = this.events;

        if (index < 0) {
            index = length - 1;
        }
        if (index > length - 1) {
            index = 0;
        }
        this.items.forEach(item => {
            item.classList.remove(self.active);
        })
        this.items[index].classList.add(this.active);
        this.curIndex = index;

        events.btnChange && events.btnChange.call(this, index);
    },
    prev: function () {
        this.move(this.curIndex - 1);
    },
    next: function () {
        this.move(this.curIndex + 1);
    }
};