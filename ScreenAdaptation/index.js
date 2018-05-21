// 屏幕适配
; (function (doc, win) {
	var docEle = doc.documentElement,
		resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		reCalc = function () {
			var clientWidth = docEle.clientWidth;
			if (!clientWidth) return;
			if (clientWidth >= 600) {
				docEle.style.fontSize = '100px';
			} else {
				docEle.style.fontSize = 100 * (clientWidth / 375) + 'px';
			}
		};
	win.addEventListener(resizeEvt, reCalc, false);
	doc.addEventListener('DOMContentLoaded', reCalc, false);
})(document,window)