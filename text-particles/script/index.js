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
            box = $('.control-box');

        btn.on("click", function () {
            box.toggleClass('drawer');
        })

        $(".shape span").each(function (index, item) {
            $(item).on("click", function () {
                $(this).addClass('cur').siblings().removeClass('cur');
                canvasShow.canvasDraw();
            })
        })

        $('.message, .gra, .dur, .speed, .rad, .res').on("input", function () {
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
            options.dur = $('.dur').val() || .4;
            options.speed = $('.speed').val() || .1;
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

            radVal = options.rad;
            // 移动效果
            this.graVal = options.gra;
            colors = options.colors;
            this.color = colors[Math.floor(Math.random() * colors.length)];

            // 大小
            this.sSize = 1.1;
            this.eSize = Common.random(radVal, radVal + 3); //[1.1,5.1]


            this.vx = 0;
            this.vy = 0;
            this.friction = .99;

            this.init();

        }

        Particle.prototype = {
            constructor: Particle,
            init: function () {
                this.getType(this.type);
                this.setSpeed(Common.random(.1, .5));

                this.setAngle(Common.random(Common.degreesToRads(0), Common.degreesToRads(360)));

                this.animate();
            },

            getType: function (type) {
                if (type === "ball") {
                    ctx.save();
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.eSize, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }

                if (type === "rect") {
                    ctx.save();
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.fillRect(this.x, this.y, this.eSize, this.eSize)
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
            },

            getAngle: function () {
                return Math.atan2(this.vy, this.vx);//atan2 其参数比值的反正切值
            },

            setAngle: function (distance) {
                var speed = this.getAngle();
                this.vx = Math.cos(distance) * speed;
                this.vy = Math.sin(distance) * speed;
            },

            getSpeed: function () {
                return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            },

            setSpeed: function (speed) {
                var angle = this.getAngle();
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
            },

            getDistance: function () {
                return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            },

            updata: function () {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.graVal;

                this.vx *= this.friction;
                this.vy *= this.friction;
                if (this.sSize < this.eSize) {
                    this.sSize += this.durVal;
                } else {

                    this.sSize -= this.durVal;
                }

                if (this.y < 0 || this.sAngle < 1) {
                    this.x = this.base[0];
                    this.y = this.base[1];
                    this.setSpeed(spdVal);
                    this.eAngle = Common.random(radVal, radVal + 3);
                    this.setHeading(Common.random(Common.degreesToRads(0), Common.degreesToRads(360)));
                }
            },

            animate: function () {
                // ctx.clearRect(0, 0, W, H);

                this.updata();
            }
        };

        function canvasDraw() {
            var options = getOptions(),
                gridX = gridY = 7 || options.res,
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

            // (function drawFrame() {
            //     window.requestAnimationFrame(drawFrame, canvas);
            //     ctx.clearRect(0, 0, W, H);

            //     for (var i = 0; i < placeAry.placement.length; i++) {
            //         new Particle.placement[i].update();
            //     }
            // } ())


        };

        canvasDraw();
        $(window).on('resize', canvasDraw);

        return {
            canvasDraw: canvasDraw
        }
    } ();



})($);