; (function ($) {

    var Common = function () {
        var random = function (min, max) {
            return Math.random() * (max - min) + min;
        },
            degreesToRads = function (degrees) {
                return degrees / 180 * Math.PI;
            };

        return {
            random: random,
            degreesToRads: degreesToRads
        }
    } ();

    // 控制面板显示
    var boxFn = function () {
        var btn = $('.control-btn'),
            body = $('body');

        btn.on("click", function () {
            body.toggleClass('drawer');
        })

        $(".shape span").each(function (index, item) {
            $(item).on("click", function () {
                $(this).addClass('cur').siblings().removeClass('cur');
                canvasShow.canvasDraw();
            })
        })

        $('.message, .gra, .dur, .time, .rad, .res').on("input", function () {
            canvasShow.canvasDraw();
        })
    } ();

    var canvasShow = function () {
        var canvas = $('.canvas').get(0),
            ctx = canvas.getContext('2d'),
            W = $('.content').innerWidth() || 400,
            H = $('.content').innerHeight() || 200;

        function getOptions() {
            var options = {};

            options.type = $('.shape span.cur').attr('data-shape') || "ball";
            options.msg = $('.message').val() || "❤";
            options.gra = $('.gra').val() || 0;
            options.dur = $('.dur').val() || .2;
            options.durTime = $('.time').val() || .1;
            options.rad = $('.rad').val() || 2;
            options.res = $('.res').val() || 7;
            options.colors = [
                '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
                '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
                '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
                '#FF5722'
            ];

            return options;
        }



        function Particle(x, y, options) {
            this.x = x;
            this.y = y;

            // 定点位置
            this.base = [x, y];

            // get type
            this.type = options.type;

            // 颜色
            colors = options.colors;
            this.color = colors[Math.floor(Math.random() * colors.length)];

            // 大小
            this.rad = +options.rad;
            this.sSize = 1.1;
            this.eSize = Common.random(this.rad, this.rad + 3); //[1.1,5.1]
            // 增幅
            this.durVal = +options.dur / 2;


            // 设置出现的粒子位置
            this.vx = Math.floor(Common.random(0, W));
            this.vy = Math.floor(Common.random(0, H));

            //角度
            this.angle = Math.atan2(this.vy - this.y, this.vx - this.x);//atan2 夹角的弧度值;

            // 速度
            this.spd = this.getDistance() / +options.durTime / 60;

        }

        Particle.prototype = {
            constructor: Particle,

            getType: function (type) {
                if (type === "ball") {
                    ctx.save();
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.vx, this.vy, this.sSize, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }

                if (type === "rect") {
                    ctx.save();
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.fillRect(this.vx, this.vy, this.sSize, this.sSize)
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
                
                if (type === "love") {
                    var vertices = this.drawLove(this.vx,this.vy,this.sSize);
                    ctx.save();
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.translate(this.vx, this.vy);
                    ctx.rotate(Math.PI);
                    for (let i = 0; i < 50; i++) {
                        var vector = vertices[i];
                        ctx.lineTo(vector.x, vector.y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
            },

            drawLove: function (x,y,r) {
                var vertices = [];
                for (var i = 0; i < 50; i++) {
                    var step = i / 50 * (Math.PI * 2);//设置心上面两点之间的角度，具体分成多少份，好像需要去试。
                    var vector = {
                        x: .1 * r * (16 * Math.pow(Math.sin(step), 3)),
                        y: .1 * r * (13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
                    }
                    vertices.push(vector);
                }

                return vertices;
            },

            getDistance: function () {
                return Math.sqrt((this.vy - this.y) * (this.vy - this.y) + (this.vx - this.x) * (this.vx - this.x));
            },


            update: function () {
                if (!this.dyingX) {
                    if (this.vx >= this.base[0]) {
                        this.vx -= this.spd * Math.cos(this.angle);
                        if (this.vx <= this.x) {
                            this.dyingX = true;
                            this.vx = this.x;
                        }
                    } else {
                        this.vx -= this.spd * Math.cos(this.angle);
                        if (this.vx >= this.x) {
                            this.dyingX = true;
                            this.vx = this.x;
                        }
                    }
                }

                if (!this.dyingY) {
                    if (this.vy >= this.base[1]) {
                        this.vy -= this.spd * Math.sin(this.angle);
                        if (this.vy <= this.y) {
                            this.dyingY = true;
                            this.vy = this.y;
                        }
                    } else {
                        this.vy -= this.spd * Math.sin(this.angle);
                        if (this.vy >= this.y) {
                            this.dyingY = true;
                            this.vy = this.y;
                        }
                    }
                }


                if (this.sSize < this.eSize && this.dyingS === false) {
                    this.sSize += this.durVal;
                } else {
                    this.dyingS = true;
                }

                if (this.dyingS) {
                    this.sSize -= this.durVal;
                }

                if (this.sSize < 1) {
                    this.dyingS = false;
                }

                this.getType(this.type);

            }

        };

        function canvasDraw() {
            var options = getOptions(),
                gridX = gridY = +options.res,
                fontSize = 100,
                placeAry = [];

            canvas.width = W;
            canvas.height = H;

            ctx.textAlign = "center";
            ctx.font = fontSize + "px arial";
            ctx.fillText(options.msg, W / 2, H / 2);
            var imageData = ctx.getImageData(0, 0, W, H),
                buffer32 = new Uint32Array(imageData.data.buffer);

            for (var j = 0; j < H; j += gridY) {
                for (var i = 0; i < W; i += gridX) {
                    if (buffer32[j * W + i]) {
                        var particle = new Particle(i, j, options);
                        placeAry.push(particle);
                    }
                }
            }


            (function drawFrame() {
                window.requestAnimationFrame(drawFrame, canvas);
                ctx.clearRect(0, 0, W, H);
                var i = 0; len = placeAry.length;
                for (; i < len; i++) {
                    placeAry[i].update();
                }
            } ())


        };

        canvasDraw();
        $(window).on('resize', canvasDraw);

        return {
            canvasDraw: canvasDraw
        }
    } ();



})($);