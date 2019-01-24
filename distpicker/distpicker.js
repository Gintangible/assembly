(function () {
    var Distpicker = function (el, options) {
        this.el = el;
        this.options = Object.assign({
            autoSelect: true,
            placeholder: true,
            province: '—— 省 ——',
            city: '—— 市 ——',
            district: '—— 区 ——',
            dataJson: ChineseDistricts || {},
            dataCode: '86' //起始code
        }, options);

        this.province = 'province';
        this.city = 'city';
        this.district = 'district';

        this.saveData = [];
        this._init();
    }

    Distpicker.prototype = {

        contructor: Distpicker,

        _init: function () {
            const self = this;
            const opitons = this.options;
            const $select = this.el.querySelectorAll('select');

            [this.province, this.city, this.district].forEach((item, i) => {
                self['$' + item] = $select[i];
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
            let data = [];

            if (!curSelect) return;

            const code = (
                type === this.province ? options.dataCode :
                type === this.city ? this.$province && this._getSelectCode(this.$province) :
                type === this.district ? this.$city && this._getSelectCode(this.$city) : ""
            );

            if (this.saveData[code]) {

            } else {
                const datalist = code ? options.dataJson[code] : null;
                if (datalist) {
                    for (var i in datalist) {
                        data.push({
                            code: i,
                            address: datalist[i],
                            // selected: selected
                        })
                    }
                    this.saveData.push({
                        code: this._getList(data)
                    })
                }
            }


            curSelect.innerHTML = this.saveData[code];
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
        reset: function (deep) {
            if (!deep) {
                this.output(this.province);
                this.output(this.city);
                this.output(this.district);
            } else if (this.$province) {
                this.$province.find(':first').prop('selected', true).trigger(EVENT_CHANGE);
            }
        },

        // 销毁
        destroy: function () {
            this.unbind();
            this.$element.removeData(NAMESPACE);
        }

    }

    new Distpicker(document.querySelector('.industry-wrap'), {
        data: ChineseDistricts
    })
    // window.Distpicker = Distpicker;
})()