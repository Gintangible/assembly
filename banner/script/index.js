var Slider = function( options ){
    var noop = function () {};

    $.extend( this, {
        element: null,
        prefix : '',
        arrow : true,
        button : true,
        interval : 3000,
        auto : true,
        current : 0,
        events : {
            btnChange : noop
        }
    }, options || {} );

    this.view = null;
    this.items = [];
    this.length = 0;
    //this.distance = 0;
    this.tID = -2;

    this.create();
};
Slider.prototype = {
    constructor : Slider,

    create : function(){
        var self = this,
            element = this.element,
            view = this.view = element.children(':first'),
            items = this.items = view.children();

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

    createArrow : function(){
        if (!this.arrow) return;

        var self = this,
            element = this.element;

        element.append(
            '<div class="s-arrow">'+
                '<i class="s-prev">&lt;</i>'+
                '<i class="s-next">&gt;</i>'+
            '</div>')
            .on('click', '.s-prev', function(){
                self.prev();
            })
            .on('click', '.s-next', function(){
                self.next();
            });

    },

    createButton : function () {
        if( !this.button ) return;

        var self = this,
            element = this.element,
            length = this.length,
            events = this.events,
            str = '', i, button, buttons;

        for(i = 0; i < length; i++){
            str += '<li class="'+ (this.current === i ? "cur" : "" )+'"></li>';
        }

        button = $('<ul class="s-button">'+str+'</ul>');
        buttons = button.find("li");
        element.append(button)
            .on('click', '.s-button li', function(){
                self.move($(this).index());
            });

        var originalOnBeforeMove = events.btnChange;

        events.btnChange = function ( index ) {
            buttons.removeClass('cur').eq(index).addClass('cur');
            return originalOnBeforeMove.apply(this, arguments);
        }
    },

    autoSlider : function () {
        if( !this.auto ) return;

        var self = this,
            element = this.element,
            start = function() {
                stop();
                self.tID = setInterval( function(){
                    self.next();
                },self.interval );
            },
            stop = function() {
                if( self.tID !== -1 ) {
                    clearInterval( self.tID );
                    self.tID = -1;
                }
            };

        start();
        element.on("mouseenter", function () {
            stop();
        }).on("mouseleave", function () {
            start();
        })

    },

    move : function( index ){
        var self = this,
            length = this.length,
            events = this.events;

        if( index < 0 ){
            index = length - 1;
        }
        if( index > length - 1 ){
            index = 0;
        }

        this.lazy(this.items.eq(index));
        this.items.removeClass("cur").eq(index).addClass('cur');
        this.current = index;

        events.btnChange && events.btnChange.call(this, index >= length ? 0 : index);
    },
    prev : function(){
        this.move(this.current - 1 );
    },
    next : function(){
        this.move(this.current + 1);
    },

    lazy : function(item){
        item.find('img[data-src]').each(function(){
            var src = this.getAttribute('data-src');
            if (src) {
                this.setAttribute('src', src);
                this.removeAttribute('data-src');
            }
        });
    }

};



















