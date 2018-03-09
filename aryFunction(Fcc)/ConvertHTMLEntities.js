// 将字符串中的字符 &、<、>、" （双引号）, 以及 ' （单引号）转换为它们对应的 HTML 实体。

function convert(str) {
	var regObj = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&apos;"
	};


	return str.split('').map(function(item){
		return regObj[item] || item;
	}).join('');
}