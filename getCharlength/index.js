function getCharLength(str) {
    return String(str).trim().split('')
        .map(s => s.charCodeAt())
        .map(n => (n < 0 || n > 255) ? 'aa' : 'a') // 中文占两字符, 其他一字符
        .join('')
        .length;
};