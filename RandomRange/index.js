/**
 * description: 生成随机在线人数并显示
 */

var RandomRange = function () {
	this.count = 0;
	this.maxBits = 6;//位数
	this.digits = new Array(this.maxBits);//数字
}

RandomRange.prototype = {
	constructor: RandomRange,

	get: function () {
		var bits = this.getRandomBits(),
			digits = this.digits,
			maxBits = this.maxBits,
			i, min, max;
		for (i = 0; i < bits; i++) {
			max = 10;
			min = 0;

			// 首位不能为0
			if (i === maxBits - 1) {
				min = 1;
			}
			digits[maxBits - i] = this.getRandom(min, max);
		}
		
		this.incermentCount();

		return digits.join('');
	},

	getRandom: function (min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	},

	getRandomBits: function () {
		var count = this.count,
			maxBits = this.maxBits,
			bits = 2;

		//数字变动的位数
		switch (count) {
			case 0:
				bits = maxBits;
				break;
			case 3:
				bits = 3;
				break;
			case 5:
				bits = 5;
				break;
			case 7:
				bits = 4;
				break;
		}

		return Math.min(bits, maxBits);
	},

	incermentCount: function () {
		var count = this.count + 1;
		if (count > 9) {
			count = 0;
		}
		this.count = count;
	}
}

/* 
* parma : container : $('xx')
*/

var showRandom = function (container) {
	var num = new RandomRange(),
		handle = function () {
			container && container.text(num.get());
			setTimeout(handle, 1000);
		};

	handle();
}

// showRandom()