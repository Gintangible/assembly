var updataImgFn = function () {
    /**
     * tailorSize           []              裁剪的大小
     * isPreview            Boolean         是否预览
     * view                                 展示预览图的容器
     * multiple             Boolean         多图
     * limitNum             number          限制的图片数
     */
    var defaultOption = {
        isPreview: true,
        view: null,
        multiple: true,
        imgSave: [],
        limitNum: 2
    };

    // 创建input[type="file"]
    function createInputFile(el) {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = 'image/*';
        inputFile.style.opacity = '0';
        inputFile.style.position = 'absolute';
        inputFile.style.left = '0';
        inputFile.style.right = '0';
        inputFile.style.bottom = '0';
        inputFile.style.top = '0';
        el.appendChild(inputFile)
        return inputFile;
    }

    // 打印 
    function msgConsole(name, type) {
        console && console[type || "log"](name);
    }

    function createPreview(el) {
        const img = document.createElement('img');
        const parent = el.parentNode;

        parent.appendChild(img);
        return img;
    }


    function imgUpload(el, options) {
        const getEl = typeof el === 'string' ? document.querySelector(el) : el;
        const isInput = getEl.nodeName.toLowerCase() === 'input';

        if (isInput && getEl.type !== 'file') {
            console.log(el.nodeName + `不是input[type="file"],在这里会type变成file`);
            getEl.type = 'file';
        }

        this.el = isInput ? getEl : createInputFile(getEl);

        this.options = Object.assign(defaultOption, options || {})

        this._init(this.options);
    }

    imgUpload.prototype = {
        constructor: imgUpload,
        // 解析options
        _analysisOptions: function (options) {
            for (let k in options) {
                this[k] = options[k];
            }
        },

        _init: function (options) {
            this._analysisOptions(options);
            this._getViewEl();
            this._bind();
        },

        // input change 
        _bind: function () {
            const self = this;
            this.el.addEventListener('change', function () {
                if(this.imgSave.length >= this.limitNum+1) {
                    throw(`图片最多上传${this.limitNum}个`);
                };
                const files = this.files;
                if (files.length) {
                    var reader = new FileReader();
                    reader.onloadstart = function (e) {
                        typeof self._loadStart === 'function' && self._loadStart(e);
                    }
                    reader.onprogress = function (e) {
                        typeof self._loadProgress === 'function' && self._loadProgress(e);
                    }
                    reader.onabort = function (e) {
                        msgConsole("中断读取....");
                    }
                    reader.onerror = function (e) {
                        msgConsole("读取异常....");
                    }
                    reader.onload = function (e) {
                        typeof self._loadComplete === 'function' && self._loadComplete(e);
                        self._preview(this.result);
                        self._saveImgData(files);
                    }
                    reader.readAsDataURL(files);
                }
            });
            // this.el.addEventListener('click', function () {
            //     self._reset();
            // })
        },

        _saveImgData: function(file){
            if(!this.multiple) this.imgSave = [];
            this.imgSave.push({
                file: file,
                name: file.name
            })
        },

        _getImgData: function(){
            return this.imgSave;
        },

        _reset: function (callback) {
            // file 文件清空
            this.el.value = '';
            // 预览图片清空
            this.view.querySelector('img').src = '';
            // 保存图片地址清空
            this.imgSave = [];
            typeof callback === 'function' && callback();
        },

        _loadComplete: function (e) {
            msgConsole(`成功
            读取文件后的回调，注意预览的容器要存在，不然会在input父级的内部创建一个img用于展示`);
        },

        _loadStart: function (e) {
            msgConsole(`开始读取....`);
        },

        _loadProgress: function () {
            msgConsole(`正在读取中....`);
        },

        // 预览
        _preview: function (src) {
            if (!this.isPreview) return;

            const img = this.view.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                this.view.appendChild(img);
            }

            img.src = src;
        },

        _getViewEl: function () {
            // 仅预览的时候，大部分input 和img在用一个位置
            if (!this.isPreview) return;
            const view = this.view || createPreview(this.el);
            const isImg = view.nodeName.toLowerCase() === 'img';
            this.view = isImg ? view.parentNode : view;
        },
    }

    window.onload = function () {
        var files = document.querySelectorAll('input[type="file"');
        files.forEach(function (item) {
            new imgUpload(item, {})
        })
    }

    return {
        imgUpload: imgUpload
    }
}();