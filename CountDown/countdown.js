;
(function () {
    function Timer(delay) {
        this._queue = [];
        this.stop = false;
        this._createTimer(delay);
    }

    Timer.prototype = {
        construct: Timer,
        _createTimer: function (delay) {
            var self = this;
            var first = true;
            (function () {
                var s = new Date();
                self._queue.forEach(function (item) {
                    item();
                })
                if (!self.stop) {
                    var cost = new Date() - s;
                    delay = first ? delay : ((cost > delay) ? cost - delay : delay);
                    setTimeout(arguments.callee, delay);
                }
            })();
            first = false;
        },
        add: function (cb) {
            this._queue.push(cb);
            this.stop = false;
        },
        remove: function (index) {
            this._queue.splice(index, 1);
            if (!this._queue.length) {
                this.stop = true;
            }
        }
    }

    function TimePool() {
        this._pool = {};
    }
    TimePool.prototype = {
        construct: TimePool,
        getTimer: function (delayTime) {
            var t = this._pool[delayTime];
            return t ? t : (this._pool[delayTime] = new Timer(delayTime));
        },
        removeTimer: function (delayTime) {
            if (this._pool[delayTime]) {
                delete this._pool[delayTime];
            }
        }
    }

    function leftPad(str, len, ch) {
        str = String(str);
        var i = -1;
        if (!ch && ch !== 0) ch = ' ';
        len = len - str.length;
        while (++i < len) {
            str = ch + str;
        }
        return str;
    }

    function formatTime(ms) {
        var s = ms / 1000,
            m = s / 60;
        return {
            d: leftPad(m / 60 / 24, 2, 0),
            h: leftPad(m / 60 % 24, 2, 0),
            d: leftPad(m % 60, 2, 0),
        }
    }

    function CountDown(config) {
        this.init();
    }

    CountDown.prototype = {
        construct: CountDown,
        init: function() {

        }
    }
})();