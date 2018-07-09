const query = selector => document.querySelector(selector),
    getClass = selector => document.querySelectorAll(selector);

// 验证
class Validator {
    constructor(config) {
        this.validatorConfig = config.validatorConfig;
        this.targetConfig = config.targetConfig;
        this.validators = config.validators;
        this.allTarget = this.targetConfig.map(config => config.target);
    }

    // 验证逻辑
    _check(config) {
        const _this = this,
            validatorCfg = this.validatorConfig,
            input = query(config.target),
            val = input.value,
            msg = query(config.message.target),
            ownValidators = config.validators;


        let required = false, // 不是必填项的话，只在有输入内容时进行检查 (默认为不必填)
            result = '';
        //遍历验证器
        ownValidators.forEach(item => {
            if (item.name == 'required') required = true; //是否有必填项

            const temp = _this.validators[item.name](val, item.args);

            if (!temp.status) {
                result = temp.message;
            }
        })

        if (!required && val.length === 0) return;

        if (result) { //有错误信息
            validatorCfg.error && validatorCfg.error(input);
            msg.textContent = result;
        } else { //验证通过
            validatorCfg.success && validatorCfg.success(input); // 成功回调
            msg.textContent = config.message.success || '';
        }
    }

    _run(target) {
        const curConfig = this.targetConfig.filter(config =>
            config.target.indexOf(target) > -1
        )[0];
        this._check(curConfig);
    }
    _runAll() {
            const _this = this;
            this.targetConfig.forEach((item) => {
                _this._check(item);
            })
        }
        // 重置表单
    _reset() {
        this.targetConfig.forEach(config => {
            query(config.target).value = '';
            query(config.message.target).textContent = config.message.placeholder || '';
        })

        this.validatorConfig.reset(this.allTarget) // 重置回调
    }
}


const validatorConfig = {
    // 失败时回调
    error(target) {
        target.parentElement.classList.remove('success')
        target.parentElement.classList.add('error')
    },
    // 成功时回调
    success(target) {
        target.parentElement.classList.remove('error')
        target.parentElement.classList.add('success')
    },
    // 重置时回调
    reset(allTarget) { // 参数为每个检查表单的 dom  对象
        allTarget.forEach(selector => {
            query(selector).parentElement.classList.remove('error', 'success')
        })
    }
};

const targetConfig = [{
        target: '#name', // 检查的 input
        message: {
            target: '.name p', // 检查结果信息展示的地方
            placeholder: '必填，长度为4~16个字符',
            success: '名称可用' // 成功时显示
        },
        // 执行的检查器
        validators: [
            // name: 验证器的名字, args: 验证器的配置参数
            {
                name: 'required',
                args: {
                    message: '名称不能为空'
                }
            }, {
                name: 'minAndMax',
                args: {
                    min: 4,
                    max: 16,
                    message: '长度需在 4 ~ 16 之间'
                }
            },
            {
                name: 'noEmpty',
                args: {
                    message: '名称不能有空格'
                }
            }
        ]
    },
    // 密码表单校验
    {
        target: '#password',
        message: {
            target: '.password p',
            placeholder: '必填，长度为6~16个字符',
            success: '密码可用'
        },
        validators: [{
            name: 'required',
            args: {
                message: '密码不能为空'
            }
        }, {
            name: 'minAndMax',
            args: {
                min: 6,
                max: 16,
                message: '长度需在 6 ~ 16 之间'
            }
        }]
    },
    // 确认密码表单校验
    {
        target: '#password_re',
        message: {
            target: '.password_re p',
            placeholder: '两次输入相同密码',
            success: '两次输入密码相同'
        },
        validators: [{
            name: 'required',
            args: {
                message: '密码不能为空'
            }
        }, {
            name: 'minAndMax',
            args: {
                min: 6,
                max: 16,
                message: '长度需在 6 ~ 16 之间'
            }
        }, {
            name: 'equalOtherValue',
            args: {
                otherForm: '#password',
                message: '两次输入的密码不一致'
            }
        }, ]
    },
    // 邮箱表单校验
    {
        target: '#email',
        message: {
            target: '.email p',
            success: '邮箱格式正确'
        },
        // 验证器列表中无 required, 说明不是必填项，只有在输入内容时才会进行检验
        validators: [{
            name: 'email',
            args: {
                message: '邮箱格式错误'
            }
        }]
    },
    // 手机表单校验
    {
        target: '#tel',
        message: {
            target: '.tel p',
            success: '手机格式正确'
        },
        validators: [{
            name: 'tel',
            args: {
                message: '手机格式错误'
            }
        }]
    }
];


// 获取字符长度 (中文长度为 2)
const getCharLength = str =>
    String(str).trim().split('')
    .map(s => s.charCodeAt())
    .map(n => (n < 0 || n > 255) ? 'aa' : 'a') // 中文占两字符, 其他一字符
    .join('')
    .length;


// 各个表单验证器
const Validators = {
    // 必填(不能为空)
    required: (str = '', { message = '' } = {}) =>
        ({
            status: !(getCharLength(str) === 0),
            message // 错误信息
        }),

    //不能有空格
    noEmpty: (str = '', { message = '' } = {}) => ({
        status: /^[^ ]+$/.test(str),
        message
    }),

    // 区间长度
    minAndMax: (str = '', { min = 0, max = 0, message = '' } = {}) => {
        const len = getCharLength(str)
        return {
            status: !(len < min || len > max),
            message
        }
    },

    // 和某表单的 value 相同
    equalOtherValue: (str = '', { otherForm = '', message = '' } = {}) =>
        ({
            status: (str === query(otherForm).value),
            message
        }),

    // 邮箱
    email: (str = '', { message = '' } = {}) =>
        ({
            status: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(str),
            message
        }),

    // 手机号
    tel: (str = '', { message = '' } = {}) =>
        ({
            status: /^1[3|4|5|7|8][0-9]{9}$/.test(str),
            message
        })
}

window.onload = function() {
    const $submit = query('#submit'),
        $reset = query('#reset'),
        inputs = getClass('.form_group input'),
        validator = new Validator({
            validatorConfig,
            validators: Validators,
            targetConfig
        });

    [].forEach.call(inputs, input => {
        input.addEventListener('blur', ev => validator._run(ev.target.id))
    })
    $submit.addEventListener('click', () => validator._runAll())
        // 重置表单
    $reset.addEventListener('click', () => validator._reset())
}