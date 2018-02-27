//使用JS检测用户是否安装某font-family字体 http://www.zhangxinxu.com/wordpress/2018/02/js-detect-suppot-font-family/

var isSupportFontFamily = function (fontFamily) {
	if (typeof fontFamily != "string") {
		return false
	}
	var defaultFontFamily = "Arial";

	if (fontFamily.toLowerCase() == defaultFontFamily.toLowerCase()) {
		return true
	}

	var font = "a";
	var d = 100;
	var width = 100, height = 100;

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;
	ctx.textAlign = "center";
	ctx.fillStyle = "black";
	ctx.textBaseline = "middle";

	var g = function (fontFamily) {
		ctx.clearRect(0, 0, width, height);
		ctx.font = d + "px " + fontFamily + ", " + defaultFontFamily;
		ctx.fillText(font, width / 2, height / 2);
		var imgData = ctx.getImageData(0, 0, width, height).data;
		return [].slice.call(imgData).filter(function (item) {
			return item != 0
		})
	};

	return g(defaultFontFamily).join("") !== g(fontFamily).join("")
};