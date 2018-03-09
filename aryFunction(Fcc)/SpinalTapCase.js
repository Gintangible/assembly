// 将字符串转换为 spinal case。Spinal case 是 all-lowercase-words-joined-by-dashes 这种形式的，也就是以连字符连接所有小写单词。
// 大写变小写，并用 - 连接



function spinalCase(str) {
    return str.replace(/\s|_/g, "-").replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();
}

spinalCase('This Is Spinal Tap');