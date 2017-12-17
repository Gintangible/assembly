/**
 * create: 2016-11-18 16:35:16
 * author: xuxufei
 * e-mail: xuxufei@2144.cn
 * description: 滑动图模块脚本
 */

var noop = function(){};

var Slider = function(options){
	$.extend(this, {
		element : null,
		prefix : '',
		arrow : true,
		button : true,
		interval : 5000,
		auto : true,
		current : 0,
		events : {
			onBeforeMove : noop,
			onAfterMove : noop
		}
	}, options || {});
	this.view = null;
	this.sport = null;
	this.items = [];
	this.length = 0;
	this.distance = 0;
	this.tID = -2;

	this.create();
};
Slider.prototype = {
	create : function(){
		var self = this,
			element = this.element,
			view = this.view = element.children(':first'),
			sport = this.sport = view.children(':first'),
			items = this.items = sport.children();
		// 获取每次移动的距离
		this.distance = items.outerWidth(true);
		// 获取项目的数量
		this.length = items.length;
		// 项目数量加倍
		sport.append(items.clone());
		// 修改sport节点的宽度
		sport.width(this.length * 2 * this.distance);
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
		element.append([
			'<div class="' + this.getClassName('arrow') + '">',
			'	<span class="' + this.getClassName('prev') + '"></span>',
			'	<span class="' + this.getClassName('next') + '"></span>',
			'</div>'
		].join(''))
			.on('click', this.getClassName('prev', true), function(){
				self.prev();
			})
			.on('click', this.getClassName('next', true), function(){
				self.next();
			});
	},
	createButton : function(){
		if (!this.button) return;
		var self = this,
			element = this.element,
			length = this.length,
			events = this.events,
			html = '', i, button, buttons;
		html += '<div class="' + this.getClassName('button') + '">';
		for(i = 0; i < length; i++){
			html += '<span';
			if (this.current === i) {
				html += ' class="cur"';
			}
			html += '></span>';
		}
		html += '</div>';
		button = $(html);
		buttons = button.find('span');
		element.append(button)
			.on('click', this.getClassName('button span', true), function(){
				self.move($(this).index());
			});
		var originalOnBeforeMove = events.onBeforeMove;
		events.onBeforeMove = function(index){
			buttons.removeClass('cur').eq(index).addClass('cur');
			return originalOnBeforeMove.apply(this, arguments);
		};
	},
	autoSlider : function(){
		if (!this.auto) return;
		var self = this,
			element = this.element,
			start = function(){
				stop();
				self.tID = setInterval(function(){
					self.next();
				}, self.interval);
			},
			stop = function(){
				if (self.tID !== -1) {
					clearInterval(self.tID);
					self.tID = -1;
				}
			};
		start();
		element.on('mouseenter', function(){
			stop();
		}).on('mouseleave', function(){
			start();
		});
	},
	move : function(index){
		var self = this,
			sport = this.sport,
			length = this.length,
			distance = this.distance,
			events = this.events;
		if (sport.is(':animated') ||
			index === this.current) return;
		if (index < 0) {
			sport.css('left', -length * distance);
			index = length - 1;
		}
		typeof events.onBeforeMove === 'function' &&
		events.onBeforeMove.call(this, index >= length ? 0 : index);
		this.lazy(this.items.eq(index));
		sport.animate({
			left : -index * distance
		}, function(){
			if (index >= length) {
				sport.css('left', 0);
				index = 0;
			}
			self.current = index;
			typeof events.onAfterMove === 'function' &&
			events.onAfterMove.call(this, index);
		});
	},
	prev : function(){
		this.move(this.current - 1);
	},
	next : function(){
		this.move(this.current + 1);
	},
	getClassName : function(name, dot){
		return (dot ? '.' : '') + this.prefix + '_' + name;
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

module.exports = function(options){
	return new Slider(options);
};