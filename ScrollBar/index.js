class ScrollBar {
    constructor(config) {
        this.el = config.el;
        this.init();
    }

    init(){
        this.create();
        this.move();
    }

    create(){
       let el = this.el;
       let div = document.createElement("div");
       div.className = 'scroll-bar';
       div.innerHTML = '<span></span>';
       el.parentNode.append(div);
    }
    positon(){
        let div = document.querySelector('scroll-bar');
        let scrollY = this.el.scrollTop;
        console.log(scrollY)
    }
    move(){
        const self = this;
        this.el.addEventListener('scroll',function(){
            self.positon()
        })
    }

}












var scrollBar = new ScrollBar({
    el: document.querySelector('.scroll-wrapper')
});