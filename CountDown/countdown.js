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

    function CountDown(config = {}) {
        var defaultOptions = {
            fixNow: 3 * 1000,
            fixNowDate: false,
            render: function (outstring) {
                console.log(outstring);
            },
            end: function () {
                console.log(`the end!`);
            },
            endTime: new Date().valueOf() + 5 * 1000
        };

        Object.assign(defaultOptions, config);

        for (let k in defaultOptions) {
            this[k] = defaultOptions[k];
        }

        this.init();
    }

    CountDown.prototype = {
        construct: CountDown,
        init: function () {
            var self = this;
            if (this.fixNowDate) {
                var fix = new timer(this.fixNow);
                fix.add(function () {
                    self.getNowTime(function (now) {
                        self.now = now;
                    });
                });
            }
            var index = msInterval.add(function () {
                self.now += delayTime;
                if (self.now >= self.endTime) {
                    msInterval.remove(index);
                    self.end();
                } else {
                    self.render(self.getOutString());
                }
            });
        },
        getBetween: function () {
            return _formatTime(this.endTime - this.now);
        },
        getOutString: function () {
            var between = this.getBetween();
            return this.template.replace(/{(\w*)}/g, function (m, key) {
                return between.hasOwnProperty(key) ? between[key] : "";
            });
        },
        getNowTime: function (cb) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', '/', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 3) {
                    var now = xhr.getResponseHeader('Date');
                    cb(new Date(now).valueOf());
                    xhr.abort();
                }
            };
            xhr.send(null);
        }
    }
})();