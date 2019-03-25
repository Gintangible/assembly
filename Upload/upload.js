var updataImgFn = function () {
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

    function imgUpload(el, options) {
        const getEl = typeof el === 'string' ? document.querySelector(el) : el;
        const isInput = getEl.nodeName.toLowerCase() === 'input';

        if (isInput && getEl.type !== 'file') {
            console.log(el.nodeName + `不是input[type="file"],在这里会type变成file`);
            getEl.type = 'file';
        }

        /**
         * isPreview            Boolean         是否预览
         * view                                 展示预览图的容器
         * multiple             Boolean         多图
         * limitNum             number          限制的图片数
         */
        var defaultOption = {
            isPreview: true,
            view: null,
            multiple: null,
            imgSave: [],
            limitNum: 1,
            isDelete: true,
            deleteClass: 'delele-btn',
            viewItemClass: 'view-item'
        };

        this.el = isInput ? getEl : createInputFile(getEl);

        this.options = Object.assign(defaultOption, options || {});

        this._init(this.options);
    }

    imgUpload.prototype = {
        constructor: imgUpload,
        // 解析options
        _analysisOptions: function (options) {
            for (let k in options) {
                this[k] = options[k];
            }

            this.multiple = this.multiple || this.el.multiple;
            this.view = typeof this.view === 'string' ? document.querySelector(this.view) : this.view ? this.view : this.el.parentNode;
        },

        _init: function (options) {
            this._analysisOptions(options);
            this._bind();
        },

        // input change 
        _bind: function () {
            const self = this;
            this.el.addEventListener('change', function () {    
                const files = this.files;
                const len = files.length;
                if (this.multiple && files.length > self.limitNum) {
                    throw (`图片最多上传${self.limitNum}个`);
                };
                self._createPreview(len);
                for (let i = 0; i < len; i++) {
                    self._fileHandle(i, files[i]);
                }
            });
            // this.el.addEventListener('click', function () {
            //     self._reset();
            // })
        },

        _fileHandle: function (i, file) {
            const self = this;
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
                self._saveImgData(i, file, this.result);
                self._preview(i, this.result);
            }
            reader.readAsDataURL(file);
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

        _saveImgData: function (i, file, result) {
            if (!this.multiple) this.imgSave = [];
            this.imgSave[i] = {
                file: file,
                name: file.name,
                result: result
            };
        },

        _getImgData: function () {
            return this.imgSave;
        },

        _reset: function (callback) {
            // file 文件清空
            this.el.value = '';
            // 预览图片清空
            this.view.innerHTML = '';
            // 保存图片地址清空
            this.imgSave = [];
            typeof callback === 'function' && callback();
        },

        _createPreview: function(totalLen){
            if (!this.isPreview) return;
            this.view.innerHTML = '';
            const img = this.view.querySelectorAll('img');
            let len = img.length;

            while(len < totalLen){
                let createImg = document.createElement('img');
                this.view.appendChild(createImg);
                len++;
            }
        },
        // 预览
        _preview: function (i, src) {
            /**
             * <div> view
             *      <img>
             * </div>
             */
            // 加载的图片顺序不一样
            if (!this.isPreview) return;
            let img = this.view.querySelectorAll('img')[i];

            img.src = src;
        }
    }

    return {
        imgUpload: imgUpload
    }
}();

window.onload = function () {
    var files = document.querySelectorAll('input[type="file"');
    files.forEach(function (item, i) {
        var a = 'file' + i;
        window[a] = new updataImgFn.imgUpload(item, {
            limitNum: 3
        })
    })
}