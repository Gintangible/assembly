;
(function () {
    var Validate = function (options) {
        /*
         *   single             Boolean         是否开启单个验证
         *   eventType          String          单个验证的事件类型
         *   verifyArray        [{
                                    target: '#name', // 检查的 input
                                    type: 'name',    //  用于保存数据，（提交的key）
                                    required: true,  // 必填
                                    // 提示
                                    message: {
                                        target: '.name p', // 检查结果信息展示的地方
                                        success: '名称可用' // 成功时显示
                                        error: '名称不可用'
                                    },
                                    validator: nameValidate
         *                      ]              验证器数组
         *   isSaveData         Boolean         是否返回input val
         *   successClass       String          返回成功的class
         *   errorClass         String          返回失败的class
         */
        this.DEFATLTOPTIONS = {
            single: true,
            eventType: 'blur',
            verifyArray: [],
            successClass: 'success',
            errorClass: 'error',
            isSaveData: false
        }

        this.options = Object.assign(this.DEFATLTOPTIONS, options);

        // 必填的长度
        this.required = 0;

        // 返回的数组
        this.dataAry = {}

        this._init();
    };

    Validate.prototype = {
        constructor: Validate,

        _init: function () {
            this.options.single && this._run();
        },

        // 验证 单个input
        _check(item) {
            /* {
            target: '#name', // 检查的 input
            required: true,
            message: {
                target: '.name p', // 检查结果信息展示的地方
                placeholder: '必填，长度为4~16个字符',
                success: '名称可用' // 成功时显示
                error: '名称不可用'
            },
            // 执行的检查器
            validator: nameValidate
            }*/
            if (!item) return;
            // 原声选择 or 在此处选择

            const input = typeof item.target === 'string' ? document.querySelector(item.target) : item.target;

            const options = this.options;
            const val = item.value || input.value || '';
            const type = item.type;
            const message = item.message;
            const isRequired = item.required;
            const validator = item.validator;

            //验证
            const result = validator(val);

            // message
            if (message) {
                const msgTarget = typeof message.target === 'string' ? document.querySelector(message.target) : message.target;

                if (!result) {
                    msgTarget.innerHTML = message.error || message.placeholder || '输入错误';
                } else {
                    msgTarget.innerHTML = message.success || message.placeholder || '输入正确';
                }
            }

            // clear class
            options.successClass && input.classList.remove(options.successClass);
            options.errorClass && input.classList.remove(options.errorClass);

            // 验证未通过 + 必选
            if (isRequired && !result) this.required++;

            if (!result && isRequired) {
                options.errorClass && input.classList.add(options.errorClass);
                return;
            }

            // 保存数据
            if (type) {
                this.dataAry[type] = val;
            }

            isRequired && options.successClass && input.classList.add(options.successClass);
        },

        // 检测
        _run: function () {
            const self = this;
            const options = this.options;
            const verifyArray = options.verifyArray;

            verifyArray.forEach(function (item) {
                const target = typeof item.target === 'string' ? document.querySelector(item.target) : item.target;
                const event = item.event ? item.event : options.eventType;
                if (!target) {
                    throw (item.target + 'maybe not existence; or ' + item.target + ' must be selector or class(id)');
                }
                target.addEventListener(event, function () {
                    self._check(item)
                });
            })
        },

        // 检测所有
        _runAll() {
            const self = this;
            const verifyArray = this.options.verifyArray;
            this.required = 0;

            verifyArray.forEach(function (item) {
                self._check(item);
            })

            return !this.required && (this.options.isSaveData ? this.dataAry : true);
        },

        // 重置
        _reset: function () {
            const options = this.options;
            this.required = 0;

            options.verifyArray.forEach(function (item) {
                const target = typeof item.target === 'string' ? document.querySelector(item.target) : item.target;
                target.value = '';
            })
        }
    };


    // sample
    function nameValidate(name) {
        return name.length > 6;
    }
    /**
     * validate email
     * @param email
     * @returns {boolean}
     */
    function emailValidate(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    }

    function phoneValidate(phone) {
        const re = /^1[34578]\d{9}$/;
        return re.test(phone)
    }


    const targetConfig = [{
            target: '#name', // 检查的 input
            type: 'name',
            required: true,
            message: {
                target: '.name p', // 检查结果信息展示的地方
                placeholder: '必填，长度为4~16个字符',
                success: '名称可用' // 成功时显示
            },
            // 执行的检查器
            validator: nameValidate
        },
        // 邮箱表单校验
        {
            target: '#email',
            type: 'email',
            required: true,
            message: {
                target: '.email p',
                success: '邮箱格式正确'
            },
            // 验证器列表中无 required, 说明不是必填项，只有在输入内容时才会进行检验
            validator: emailValidate
        },
        // 手机表单校验
        {
            target: '#tel',
            type: 'tel',
            required: true,
            message: {
                target: '.tel p',
                success: '手机格式正确'
            },
            validator: phoneValidate
        }
    ];


    const $submit = document.querySelector('#submit'),
        $reset = document.querySelector('#reset'),
        validate = new Validate({
            verifyArray: targetConfig
        });

    $submit.addEventListener('click', () => {
        const runAll = validate._runAll()
        console.log(runAll);
    })
    // 重置表单
    $reset.addEventListener('click', () => validate._reset())
})();