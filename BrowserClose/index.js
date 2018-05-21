var titAnimationFn = function () {
    var msg = document.title + '   ',
        titAnimation = function () {
            msg = msg.substring(1, msg.length) + msg.substring(0, 1);
            document.title = msg;
        };

    setInterval(titAnimation, 300);
};

titAnimationFn();