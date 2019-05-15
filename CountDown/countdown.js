;
(function() {
    function leftPad(str, len = 2, ch = 0) {
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
        var s = Math.floor(ms / 1000),
            m = Math.floor(s / 60);
        console.log(leftPad(m / 60 / 24, 2, 0), leftPad(m / 60 % 24, 2, 0), leftPad(m % 60, 2, 0), leftPad(s % 60, 2, 0))
        return {
            d: Math.floor(m / 60 / 24),
            h: leftPad(Math.floor(m / 60) % 24, 2, 0),
            m: leftPad(m % 60, 2, 0),
            s: leftPad(s % 60, 2, 0)
        };
    }

    function CountDown(config = {}) {
        var defaultOptions = {
            delaytime: 1000,
            template: '{d}:{h}:{m}:{s}',
            now: new Date().valueOf(),
            render: function(outstring) {
                console.log(outstring);
            },
            end: function() {
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
        init: function() {
            var self = this;
            (function() {
                self.now += self.delaytime
                if (self.now >= self.endTime) {
                    self.end();
                } else {
                    setTimeout(arguments.callee, self.delaytime);
                    self.render(self.getOutString());
                }
            })();
        },
        getBetween: function() {
            return formatTime(this.endTime - this.now);
        },
        getOutString: function() {
            var between = this.getBetween();
            console.log(between)
            return this.template.replace(/{(\w*)}/g, function(m, key) {
                return between.hasOwnProperty(key) ? between[key] : "";
            });
        }
    }

    var now = Date.now();

    new CountDown({
        endTime: now + 5 * 1000
    });
})();