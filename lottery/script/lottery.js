var Lottery = function (options) {
    this.wrap = options.wrap || null;
    this.items = options.items;
    this.button = options.button || null;


    this.index = 0; //当前转动到哪个位置，起点位置
    this.count = 10; //总共有多少个位置
    this.timer = 0; //setTimeout的ID，用clearTimeout清除
    this.speed = 200; //初始转动速度
    this.times = 0; //转动次数
    this.cycle = 50; //转动基本次数：即至少需要转动多少次再进入抽奖环节
    this.prize = 0; //中奖位置
    this.data = null; //储存中奖信息

    this.status = false;
    this.init();
};

Lottery.prototype = {

    constructor: Lottery,

    init: function () {
        this.events();
    },

    getData: function (callback) {
        var self = this,
            data ={
            "status": Math.floor(Math.random()*3),
            "id": Math.floor(Math.random()*11)
            };
        self.data = data;
        self.isRoll(callback);

        // $.ajax({
        //     url: "../test.json",
        //     dataType: "jsonp",
        //     success: function (data) {
        //         self.data = data;
        //         self.isRoll(callback);
        //     }
        //
        // })
        //
    },

    isRoll: function (callback) {
        var data = this.data,
            status = data.status;

        if (status == 0) {
            alert("不可抽奖")
            callback && callback();
            return;
        }

        if (status == 1) {
            this.prizeSet(data.id, callback);
        }

        if (status == 2) {
            this.prizeSet((Math.random() > .5 ? 7 : 7), callback);
        }
    },

    prizeSet: function (index, callback) {
        this.prize = index;
        this.stop(callback);
    },

    actRoll: function () {
        var self = this,
            index = this.index;

        if ($(".lottery-unit-" + index)) {
            $(".lottery-unit-" + index).removeClass("cur");
        }

        index++;

        if (index > this.count) index = 1;

        $(".lottery-unit-" + index).addClass("cur");

        this.index = index;

    },

    stop: function (callback) {
        var self = this,
            data = this.data,
            prize = this.prize;

        this.times++;
        this.actRoll();
        if (this.times > this.cycle + 10 && prize == this.index) {
            clearTimeout(this.timer);
            if (this.data) {
                if (data.status == 2) {//谢谢参与
                    setTimeout(function () {
                        alert("谢谢参与")
                    }, 500);
                } else {
                    setTimeout(function () {
                        alert("中奖提示");
                    }, 500)
                }
            }
            callback && callback();

        } else {
            if (this.times <= this.cycle) {
                this.speed -= 10;
            } else {
                if (this.times > this.cycle + 10 && ((this.prize == 0 && this.index == 16) || this.prize == this.index + 1)) {
                    this.speed += 110;
                } else {
                    this.speed += 20;
                }
            }
            if (this.speed < 40) {
                this.speed = 40;
            }
            this.timer = setTimeout(function () {
                self.stop(callback);
            }, self.speed);
        }
    },


    events: function () {
        var self = this;
        this.button.on('click', function () {
            if (self.status) return;
            self.status = true;
            self.getData(function () {
                self.status = false;
                self.prize = -1;
                self.times = 0;
                self.speed = 200;
            });
        });
    }

}

new Lottery({
    wrap: $("#lottery_box"),
    items: $("lottery-unit"),
    button: $("#lottery_start"),
});