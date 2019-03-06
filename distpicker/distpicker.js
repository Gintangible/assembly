(function () {
    var Distpicker = function (el, options) {
        this.el = el;
        /*  autoSelect          Boolean     自动选择,第一个
         *   placeholder         Boolean     设置的默认值
         *   province            String      一级默认值
         *   city                String      二级默认值
         *   district            String      三级默认值
         *   dataJson            Object      三级联动的数据
         *   dataCode            string      三级联动的起始key
         */
        //  default 单独设置，不然会替代，导致设置地址时，再切换地址，会把设置的地址带上
        this.default = {
            province: '—— 省 ——',
            city: '—— 市 ——',
            district: '—— 区 ——'
        };

        this.options = Object.assign({
            autoSelect: true,
            placeholder: true,
            dataJson: ChineseDistricts || {},
            dataCode: '86' //起始code
        }, this.default, options);

        this.province = 'province';
        this.city = 'city';
        this.district = 'district';

        // 缓存数据html
        this.saveData = {};
        this._init();
    }

    Distpicker.prototype = {
        contructor: Distpicker,

        _init: function () {
            if (!this.el.nodeName) {
                throw new TypeError('el must be 原生')
            }
            const self = this;
            const $select = this.el.querySelectorAll('select');
            const types = [this.province, this.city, this.district];

            $select.forEach((item, i) => {
                self['$' + types[i]] = item;
            })

            this._bind();

            // Reset all the selects (after event binding)
            this.reset();
        },

        // 绑定事件
        _bind: function () {
            const self = this;

            if (this.$province) {
                this.$province.addEventListener('change', (this._changeProvince = function () {
                    self.output(self.city);
                    self.output(self.district);
                }));
            }

            if (this.$city) {
                this.$city.addEventListener('change', (this._changeCity = function () {
                    self.output(self.district);
                }));
            }
        },

        unbind: function () {
            if (this.$province) {
                this.$province.removeEventListener('change', this._changeProvince);
            }

            if (this.$city) {
                this.$city.removeEventListener('change', this._changeCity);
            }
        },

        output: function (type) {
            const curSelect = this['$' + type];
            const options = this.options;
            const placeholder = options.placeholder;
            let data = [];
            const value = options[type];
            let matched; //匹配到设置默认值
            if (!curSelect) return;

            const code = (
                type === this.province ? options.dataCode :
                type === this.city ? this.$province && this._getSelectCode(this.$province) :
                type === this.district ? this.$city && this._getSelectCode(this.$city) : type
            );

            if(!code) return;
            // 本地缓存node
            var item = this.saveData[code],
                node = item && item.element;
            if (!node) {
                const datalist = code ? options.dataJson[code] : null;
                if (datalist) {
                    for (var i in datalist) {
                        var selected = datalist[i] === value;
                        if (selected) matched = true;
                        data.push({
                            code: i,
                            address: datalist[i],
                            selected: selected
                        })
                    }
                };
                // Add placeholder option
                // 非设置时，自动填充第一个
                if (options.autoSelect && !matched) {
                    data[0].selected = true;
                }

                if (placeholder) {
                    data.unshift({
                        code: '',
                        address: this.default[type],
                        selected: false
                    });
                }

                node = this._getList(data);
                this.saveData[code] = {
                    element: node
                };
            }

            curSelect.innerHTML = node;
        },

        _getSelectCode: function (el) {
            const index = el.selectedIndex;
            const slected = el.options[index];
            return slected.getAttribute('data-code');
        },

        // 获取数据 + 初始化标签 
        _getList: function (data) {
            let list = [];

            data.forEach(item => {
                list.push(
                    '<option' +
                    ' value="' + (item.address && item.code ? item.address : '') + '"' +
                    ' data-code="' + (item.code || '') + '"' +
                    (item.selected ? ' selected' : '') +
                    '>' +
                    (item.address || '') +
                    '</option>'
                );
            });

            return list.join('');
        },

        // 重置
        reset: function () {
            this.output(this.province);
            this.output(this.city);
            this.output(this.district);
        },

        // 销毁
        destroy: function () {
            this.unbind();
        }

    }

    new Distpicker(document.querySelector('.industry-wrap'), {
        dataJson: ChineseDistricts,
        province: "浙江省",
        city: "杭州市",
        district: "西湖区"
    });
    window.Distpicker = Distpicker;
})();